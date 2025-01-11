import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from 'lucide-react';


interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  numberOfOrders: string;
  amountSpent: {
    amount: string;
    currencyCode: string;
  };
  createdAt: string;
  note: string | null;
  verifiedEmail: boolean;
  tags: string[];
  lifetimeDuration: string;
  canDelete: boolean;
}

interface CustomersData {
  data: {
    customers: {
      edges: Array<{
        node: Customer;
      }>;
    };
  };
}

const CustomersTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('user')
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/shopify_customers/${user}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data: CustomersData = await response.json();
        setCustomers(data.data.customers.edges.map(edge => edge.node));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Customer List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">
                  {customer.firstName} {customer.lastName}
                </h3>
                {customer.tags.includes('VIP') && (
                  <Badge className="bg-gold text-black">VIP</Badge>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="text-blue-600">{customer.email}</p>
                <p>Orders: {customer.numberOfOrders}</p>
                <p>Spent: {customer.amountSpent.amount} {customer.amountSpent.currencyCode}</p>
                <p>Member since: {formatDate(customer.createdAt)}</p>
                <p>Duration: {customer.lifetimeDuration}</p>
                {customer.note && (
                  <p className="text-gray-600 italic">Note: {customer.note}</p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className={customer.verifiedEmail ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                  {customer.verifiedEmail ? "Verified" : "Unverified"}
                </Badge>
                {customer.canDelete && (
                  <Badge className="bg-blue-500 text-white">Deletable</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomersTable;