from django.core.management.base import BaseCommand
from faker import Faker
from product.models import Product, Category, Brand, ProductReview, ProductImage
import random
from decimal import Decimal
import os
from django.core.files.base import ContentFile
import requests
from io import BytesIO

class Command(BaseCommand):
    help = 'Create dummy products using Faker'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=20,
            help='Number of products to create (default: 20)'
        )
        parser.add_argument(
            '--categories',
            type=int,
            default=5,
            help='Number of categories to create (default: 5)'
        )
        parser.add_argument(
            '--brands',
            type=int,
            default=10,
            help='Number of brands to create (default: 10)'
        )
        parser.add_argument(
            '--reviews',
            type=int,
            default=50,
            help='Number of reviews to create (default: 50)'
        )
        parser.add_argument(
            '--images',
            type=int,
            default=3,
            help='Number of images per product (default: 3)'
        )
        parser.add_argument(
            '--no-download',
            action='store_true',
            help='Skip downloading actual images (faster)'
        )

    def handle(self, *args, **options):
        fake = Faker()
        
        # Create categories
        categories_count = options['categories']
        self.stdout.write(f'Creating {categories_count} categories...')
        
        tech_categories = [
            'Smartphones', 'Laptops', 'Tablets', 'Smart Watches', 'Headphones',
            'Cameras', 'Gaming', 'Accessories', 'Smart Home', 'Audio Equipment',
            'Computer Components', 'Networking', 'Software', 'Storage', 'Monitors'
        ]
        
        categories = []
        for i in range(categories_count):
            category_name = random.choice(tech_categories) if i < len(tech_categories) else fake.word().title()
            category, created = Category.objects.get_or_create(name=category_name)
            if created:
                categories.append(category)
                self.stdout.write(f'  Created category: {category.name}')
            else:
                categories.append(category)
                self.stdout.write(f'  Using existing category: {category.name}')

        # Create brands
        brands_count = options['brands']
        self.stdout.write(f'Creating {brands_count} brands...')
        
        tech_brands = [
            'Apple', 'Samsung', 'Google', 'Microsoft', 'Sony', 'LG', 'Dell',
            'HP', 'Lenovo', 'ASUS', 'Acer', 'Nintendo', 'Canon', 'Nikon',
            'Bose', 'JBL', 'Logitech', 'Razer', 'Corsair', 'Intel', 'AMD'
        ]
        
        brands = []
        for i in range(brands_count):
            brand_name = random.choice(tech_brands) if i < len(tech_brands) else fake.company()
            brand, created = Brand.objects.get_or_create(name=brand_name)
            if created:
                brands.append(brand)
                self.stdout.write(f'  Created brand: {brand.name}')
            else:
                brands.append(brand)
                self.stdout.write(f'  Using existing brand: {brand.name}')

        # Create products
        products_count = options['count']
        self.stdout.write(f'Creating {products_count} products...')
        
        tech_product_types = [
            'Smartphone', 'Laptop', 'Tablet', 'Smart Watch', 'Wireless Headphones',
            'Bluetooth Speaker', 'Gaming Mouse', 'Mechanical Keyboard', 'Monitor',
            'Graphics Card', 'Processor', 'RAM', 'SSD', 'Hard Drive', 'Webcam',
            'Power Bank', 'Wireless Charger', 'USB Cable', 'Phone Case', 'Screen Protector'
        ]
        
        created_products = []
        for _ in range(products_count):
            product_type = random.choice(tech_product_types)
            brand = random.choice(brands)
            category = random.choice(categories)
            
            # Generate product name
            product_name = f"{brand.name} {product_type} {fake.word().title()}"
            
            # Generate description
            description = fake.text(max_nb_chars=500)
            
            # Generate realistic tech product price
            if product_type in ['Smartphone', 'Laptop', 'Tablet']:
                price = Decimal(str(round(random.uniform(299.99, 1999.99), 2)))
            elif product_type in ['Smart Watch', 'Wireless Headphones', 'Bluetooth Speaker']:
                price = Decimal(str(round(random.uniform(49.99, 399.99), 2)))
            elif product_type in ['Graphics Card', 'Processor']:
                price = Decimal(str(round(random.uniform(199.99, 899.99), 2)))
            elif product_type in ['Monitor']:
                price = Decimal(str(round(random.uniform(149.99, 599.99), 2)))
            else:
                price = Decimal(str(round(random.uniform(9.99, 199.99), 2)))
            
            product = Product.objects.create(
                name=product_name,
                description=description,
                price=price,
                category=category,
                brand=brand
            )
            created_products.append(product)
            self.stdout.write(f'  Created product: {product.name} - ${product.price}')

        # Create product images
        images_per_product = options['images']
        no_download = options['no_download']
        
        if created_products and images_per_product > 0:
            self.stdout.write(f'Creating {images_per_product} images per product...')
            
            for product in created_products:
                for i in range(images_per_product):
                    try:
                        # Always download and save actual images for Django ImageField
                        width = random.randint(600, 1200)
                        height = random.randint(400, 800)
                        image_url = f"https://picsum.photos/{width}/{height}?random={random.randint(1, 10000)}"
                        
                        if no_download:
                            # Create a minimal 1x1 pixel placeholder to satisfy ImageField
                            # This is faster than downloading full images
                            placeholder_url = "https://picsum.photos/1/1"
                            response = requests.get(placeholder_url, timeout=5)
                        else:
                            # Download full-size images
                            response = requests.get(image_url, timeout=10)
                        
                        if response.status_code == 200:
                            image_content = ContentFile(response.content)
                            image_name = f"{product.name.replace(' ', '_').lower()}_{i+1}.jpg"
                            
                            product_image = ProductImage(product=product)
                            product_image.image.save(image_name, image_content, save=True)
                            
                            if no_download:
                                self.stdout.write(f'  Created minimal placeholder for {product.name}')
                            else:
                                self.stdout.write(f'  Downloaded and saved image for {product.name}: {image_name}')
                        else:
                            self.stdout.write(f'  Failed to download image for {product.name}')
                            
                                
                    except Exception as e:
                        self.stdout.write(f'  Error creating image for {product.name}: {str(e)}')
                        continue

        # Create reviews
        reviews_count = options['reviews']
        if created_products and reviews_count > 0:
            self.stdout.write(f'Creating {reviews_count} reviews...')
            
            for _ in range(reviews_count):
                product = random.choice(created_products)
                username = fake.user_name()
                rating = random.randint(1, 5)
                
                # Generate review text based on rating
                if rating >= 4:
                    review_text = fake.text(max_nb_chars=300) + " Great product, highly recommended!"
                elif rating == 3:
                    review_text = fake.text(max_nb_chars=250) + " It's okay, meets expectations."
                else:
                    review_text = fake.text(max_nb_chars=200) + " Could be better, had some issues."
                
                review = ProductReview.objects.create(
                    username=username,
                    product=product,
                    review_text=review_text,
                    rating=rating
                )
                self.stdout.write(f'  Created review by {username} for {product.name} - {rating} stars')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {len(categories)} categories, '
                f'{len(brands)} brands, {len(created_products)} products, '
                f'{reviews_count} reviews, and images!'
            )
        )
