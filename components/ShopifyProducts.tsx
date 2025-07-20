import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    edges: Array<{
      node: {
        url: string;
      };
    }>;
  };
}

interface ProductsData {
  data: {
    shop: {
      url: string;
    };
    products: {
      edges: Array<{
        node: Product;
      }>;
    };
  };
}

interface Integration {
  id: string;
  shop: string;
  platform: string;
  status: 'none' | 'pending' | 'successful' | 'error';
  created_at: string;
}

interface ShopifyProductsProps {
  integration?: Integration;
}

const ProductsTable: React.FC<ShopifyProductsProps> = ({ integration }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [shopUrl, setShopUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!integration) {
      setIsLoading(false);
      return;
    }

    console.log('fetching products for integration:', integration.shop)
    const user = localStorage.getItem('user')
    console.log(user)
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/shopify_products/${user}/${integration.id}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shop: integration.shop })
        });

        const data: ProductsData = await response.json();
        console.log(data);
        setShopUrl(data.data.shop.url);
        setProducts(data.data.products.edges.map(edge => edge.node));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [integration]);

  if (!integration) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-xl text-gray-600">Please select an integration to view products</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-xl text-gray-600">No Products found for {integration.shop}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Products Catalog - {integration.shop}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-4">
              {product.images.edges[0] ? (
                <img
                  src={product.images.edges[0].node.url}
                  alt={product.title}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 mb-4 rounded flex items-center justify-center">
                  No Image
                </div>
              )}
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">
                {product.description || 'No description available'}
              </p>
              <a
                href={`${shopUrl}/products/${product.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Product
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsTable;