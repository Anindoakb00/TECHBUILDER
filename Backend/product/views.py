from rest_framework import viewsets
from rest_framework.permissions import (
    IsAuthenticated, 
    AllowAny, 
    IsAdminUser
)

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import (
    Product, 
    ProductReview,
    Category,
    Brand,
)
from .serializers import (
    ProductListViewSerializer,
    ProductDetailViewSerializer,
    ProductCreateSerializer,  
    ProductUpdateSerializer,
    ProductReviewSerializer,
    ProductReviewCreateSerializer,
    CategorySerializer,
    BrandSerializer,
)

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete']
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'brand']
    ordering_fields = ['price']
    search_fields = ['name']

    def get_permissions(self):
        if self.request.method in ['POST', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]
    
    def get_queryset(self):
        return Product.objects.all().prefetch_related('images').select_related('category', 'brand')
    
    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return ProductCreateSerializer
        if self.request.method in ['PATCH']:
            return ProductUpdateSerializer
        if self.action == 'retrieve':
            return ProductDetailViewSerializer
        return ProductListViewSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_permissions(self):
        if self.request.method in ['POST', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_permissions(self):
        if self.request.method in ['POST', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]
    
class ProductReviewViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'delete']
    
    def get_permissions(self):
        if self.request.method in ['POST', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_queryset(self):
        return ProductReview.objects.all().select_related('product')
    
    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return ProductReviewCreateSerializer
        return ProductReviewSerializer

