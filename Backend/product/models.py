from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='products')
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE, related_name='products')

    def __str__(self):
        return self.name
    
class Category(models.Model):
    name = models.CharField(max_length=255,unique=True)

    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=255,unique=True)

    def __str__(self):
        return self.name
    
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/')

    def __str__(self):
        return f"Image for {self.product.name}"
    

class ProductReview(models.Model):
    username = models.CharField(max_length=150)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    review_text = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.product.name}"
