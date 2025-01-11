'use client'

import { IconCheck, IconClock } from "@tabler/icons-react"


import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from "@components/ui/input"    
import { Button } from "@components/ui/Button"
import { Alert, AlertDescription } from "@components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/Card" 
import { LoadingSkeleton } from '@components/loading-skeleton'
import { StatusBadge } from '@components/status-badge'
import { useToast } from "@components/ui/use-toast"
import ShopifyProducts from '@components/ShopifyProducts'
import ShopifyCustomers from '@components/ShopifyCustomers'

export default function DataIntegrations() {
  const { toast } = useToast()
  const [shopifyUrl, setShopifyUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [integrationStatus, setIntegrationStatus] = useState('none')
  const [connectedShopName, setConnectedShopName] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    checkExistingIntegrations()
  }, [])

  const checkExistingIntegrations = async () => {
    try {
      const user = localStorage.getItem('user')
      if (!user) {
        setLoading(false)
        return
      }

      const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/get_dataintegrations/${user}/`)
      const data = await response.json()

      if (response.ok && data.dataintegrations?.length > 0) {
        const latestIntegration = data.dataintegrations[data.dataintegrations.length - 1]
        
        setIntegrationStatus(latestIntegration.status)
        setConnectedShopName(latestIntegration.shop)
        
        if (latestIntegration.status === 'pending') {
          setShopifyUrl(latestIntegration.shop)
        }
      }
    } catch (error) {
      console.error('Error checking integrations:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check existing integrations. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      if (!shopifyUrl) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter your Shopify store URL",
        })
        return
      }

      const user = localStorage.getItem('user')
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please log in to connect your store",
        })
        return
      }

      setIsConnecting(true)
      const state = crypto.randomUUID()
      sessionStorage.setItem('shopifyState', state)

      const authUrl = `https://purpleberry-chatbot-404342c65d45.herokuapp.com/auth/login?shop=${shopifyUrl}&state=${state}`
      
      localStorage.setItem('pendingShopifyIntegration', JSON.stringify({
        shop: shopifyUrl,
        user: user
      }))

      window.location.href = authUrl

    } catch (error) {
      console.error('Error connecting store:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect Shopify store. Please try again.",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    const handleRedirectBack = async () => {
      const pendingIntegration = localStorage.getItem('pendingShopifyIntegration')
      
      if (!pendingIntegration) return
      
      setLoading(true)
      const { shop, user } = JSON.parse(pendingIntegration)
      
      try {
        const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/store_dataintegrations/${user}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shop })
        })

        if (!response.ok) throw new Error('Failed to store integration')

        localStorage.removeItem('pendingShopifyIntegration')
        await checkExistingIntegrations()
        
        toast({
          title: "Success",
          description: "Shopify store connected successfully!",
        })

      } catch (error) {
        console.error('Error storing integration:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to complete Shopify integration. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    handleRedirectBack()
  }, [])

  const handleDelete = async () => {
    console.log('deleting integration')
    setLoading(true)
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please log in to delete the integration",
        });
        return;
      }

      const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/delete_dataintegrations/${user}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to delete integration');

      await checkExistingIntegrations();

      toast({
        title: "Success",
        description: "Shopify integration deleted successfully!",
      });

    } catch (error) {
      console.error('Error deleting integration:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete Shopify integration. Please try again.",
      });
    } finally {
      checkExistingIntegrations()
      setIntegrationStatus('none')
      setConnectedShopName('')
      setShopifyUrl('')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Integrations</h1>
          <p className="text-muted-foreground mt-2">Connect your data sources to enable AI-powered insights</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Shopify Integration</CardTitle>
          <CardDescription>
            Connect your Shopify store to sync products, customers, and orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {integrationStatus === 'successful' ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Image
                  src="/shopify-logo.png"
                  alt="Shopify Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
                <StatusBadge status="successful" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Shopify Connected Successfully</p>
                <p className="text-muted-foreground">Connected to {connectedShopName}</p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="mt-4"
              >
                Delete Integration
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/shopify-logo.png"
                    alt="Shopify Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  {integrationStatus === 'pending' && <StatusBadge status="pending" />}
                </div>
              </div>

              {integrationStatus === 'pending' && (
                <Alert>
                  <AlertDescription>
                    Integration pending for {connectedShopName}. Click connect to continue the integration process.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="shopify-url" className="text-sm font-medium">
                    Shopify Store URL
                  </label>
                  <Input
                    id="shopify-url"
                    type="text"
                    placeholder="your-store.myshopify.com"
                    value={shopifyUrl}
                    onChange={(e) => setShopifyUrl(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleConnect}
                  className="w-full bg-[#96bf48] hover:bg-[#85ab3f] text-white"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Connecting...
                    </>
                  ) : integrationStatus === 'pending' ? (
                    'Continue Integration'
                  ) : (
                    'Connect Shopify Store'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {integrationStatus === 'successful' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>View and manage your Shopify products</CardDescription>
            </CardHeader>
            <CardContent>
              <ShopifyProducts />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>View and manage your Shopify customers</CardDescription>
            </CardHeader>
            <CardContent>
              <ShopifyCustomers />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

