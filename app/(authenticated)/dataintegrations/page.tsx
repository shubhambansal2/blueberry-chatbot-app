'use client'

import { IconCheck, IconClock, IconTrash } from "@tabler/icons-react"
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Input } from "@components/ui/input"    
import { Button } from "@components/ui/Button"
import { Alert, AlertDescription } from "@components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/Card" 
import { LoadingSkeleton } from '@components/loading-skeleton'
import { StatusBadge } from '@components/status-badge'
import { useToast } from "@components/ui/use-toast"
import ShopifyProducts from '@components/ShopifyProducts'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog"
// import ShopifyCustomers from '@components/ShopifyCustomers'

interface Integration {
  id: string
  shop: string
  platform: string
  status?: 'none' | 'pending' | 'successful' | 'error'
  created_at: string
}

export default function DataIntegrations() {
  const { toast } = useToast()
  const [shopifyUrl, setShopifyUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(false)
  const [integrationToDelete, setIntegrationToDelete] = useState<Integration | null>(null)
  const hasProcessedRedirect = useRef(false)

  // Track if shop param exists in URL
  const [shopParamInUrl, setShopParamInUrl] = useState(false)

  useEffect(() => {
    checkExistingIntegrations()
  }, [])

  // Handle shop URL parameter
  useEffect(() => {
    const handleShopUrlParam = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const shopParam = urlParams.get('shop')
      
      setShopParamInUrl(!!shopParam) // <-- Add this line to track if shop param exists
      
      if (shopParam) {
        console.log('🔗 Shop parameter detected:', shopParam)
        
        const user = localStorage.getItem('user')
        if (!user) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please log in to connect your store",
          })
          return
        }

        // Check if integration already exists
        const existingIntegrations = integrations.filter(integration => integration.shop === shopParam)
        if (existingIntegrations.length > 0) {
          console.log('⚠️ Integration already exists for shop:', shopParam)
          toast({
            title: "Info",
            description: "Shopify store is already connected!",
          })
          // Do not remove the shop parameter from the URL
          return
        }

        try {
          setLoading(true)
          console.log('✅ Creating integration for shop:', shopParam)
          
          const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/store_dataintegrations/${user}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shop: shopParam })
          })

          if (!response.ok) throw new Error('Failed to store integration')

          console.log('✅ Integration created successfully')

          // Add the new integration to the local state immediately
          // const newIntegration: Integration = {
          //   id: Date.now().toString(), // Temporary ID
          //   shop: shopParam,
          //   platform: 'Shopify',
          //   created_at: new Date().toISOString()
          // }
          // 
          // setIntegrations(prev => [...prev, newIntegration])
          // setSelectedIntegration(newIntegration)
          
          // Also refresh from server to get the real ID
          await checkExistingIntegrations()
          // Optionally, setSelectedIntegration to the new integration if you can identify it from the refreshed list
          const updatedIntegrations = integrations.filter(integration => integration.shop === shopParam)
          if (updatedIntegrations.length > 0) {
            setSelectedIntegration(updatedIntegrations[updatedIntegrations.length - 1])
          }
          
          toast({
            title: "Success",
            description: "Shopify store connected successfully!",
          })

          // Do not remove the shop parameter from the URL

        } catch (error) {
          console.error('❌ Error storing integration:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to complete Shopify integration. Please try again.",
          })
        } finally {
          setLoading(false)
        }
      }
    }

    handleShopUrlParam()
  }, [integrations]) // Depend on integrations to ensure we have the latest data

  // Cleanup processing flag on component unmount
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('processingShopifyRedirect')
    }
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

      // Log the raw integrations from backend
      console.log('Fetched integrations:', data.dataintegrations)

      if (response.ok && data.dataintegrations?.length > 0) {
        // Transform the data to include platform information
        const transformedIntegrations = data.dataintegrations.map((integration: any) => ({
          id: integration.id || Math.random().toString(),
          shop: integration.shop,
          platform: 'Shopify',
          created_at: integration.created_at || new Date().toISOString()
        }))

        // Deduplicate by shop
        const uniqueIntegrations: Integration[] = []
        const seenShops = new Set()
        for (const integration of transformedIntegrations) {
          if (!seenShops.has(integration.shop)) {
            uniqueIntegrations.push(integration)
            seenShops.add(integration.shop)
          }
        }

        setIntegrations(uniqueIntegrations)

        // Set the latest integration as selected if none is selected
        if (!selectedIntegration && uniqueIntegrations.length > 0) {
          setSelectedIntegration(uniqueIntegrations[uniqueIntegrations.length - 1])
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

      // Store redirect data with timestamp
      const redirectData = {
        shop: shopifyUrl,
        user: user,
        timestamp: Date.now()
      }
      sessionStorage.setItem('shopifyRedirect', JSON.stringify(redirectData))
      console.log('🚀 Stored redirect data:', redirectData)

      const authUrl = `https://purpleberry-chatbot-404342c65d45.herokuapp.com/auth/login?shop=${shopifyUrl}&state=${state}`
      console.log('🔗 Redirecting to:', authUrl)

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

  // Handle redirect back from Shopify - sessionStorage approach
  useEffect(() => {
    const handleRedirectBack = async () => {
      console.log('🔍 Checking for Shopify redirect...')
      
      // Prevent multiple processing
      if (hasProcessedRedirect.current) {
        console.log('🔄 Already processed redirect in this session')
        return
      }
      
      // Check for recent Shopify redirect
      const redirectData = sessionStorage.getItem('shopifyRedirect')
      console.log('📦 Redirect data from sessionStorage:', redirectData)
      
      if (!redirectData) {
        console.log('❌ No redirect data found')
        return
      }

      try {
        const { shop, user, timestamp } = JSON.parse(redirectData)
        console.log('📋 Parsed redirect data:', { shop, user, timestamp })
        
        // Validate timestamp (3 minutes window)
        const timeDiff = Date.now() - timestamp
        const THREE_MINUTES = 3 * 60 * 1000
        console.log('⏰ Time difference:', timeDiff, 'ms (max:', THREE_MINUTES, 'ms)')
        
        if (timeDiff > THREE_MINUTES) {
          console.log('⏰ Redirect data expired, clearing sessionStorage')
          sessionStorage.removeItem('shopifyRedirect')
          return
        }

        // Check if already processing
        if (isProcessingRedirect) {
          console.log('🔄 Already processing redirect, skipping')
          return
        }

        // Validate current user matches redirect user
        const currentUser = localStorage.getItem('user')
        console.log('👤 Current user:', currentUser, 'vs redirect user:', user)
        if (currentUser !== user) {
          console.log('❌ User mismatch, clearing redirect data')
          sessionStorage.removeItem('shopifyRedirect')
          return
        }

        // Check if integration already exists
        const existingIntegrations = integrations.filter(integration => integration.shop === shop)
        console.log('🔍 Existing integrations for shop:', existingIntegrations.length)
        if (existingIntegrations.length > 0) {
          console.log('⚠️ Integration already exists for shop:', shop)
          sessionStorage.removeItem('shopifyRedirect')
          toast({
            title: "Info",
            description: "Shopify store is already connected!",
          })
          return
        }

        console.log('✅ All checks passed, creating integration for shop:', shop)
        
        // Mark as processed to prevent infinite loop
        hasProcessedRedirect.current = true
        
        // Set processing flag to prevent duplicate calls
        setIsProcessingRedirect(true)
        setLoading(true)

        const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/store_dataintegrations/${user}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shop })
        })

        if (!response.ok) throw new Error('Failed to store integration')

        console.log('✅ Integration created successfully')

        // Clear sessionStorage after successful integration
        sessionStorage.removeItem('shopifyRedirect')
        
        // Add the new integration to the local state immediately
        const newIntegration: Integration = {
          id: Date.now().toString(), // Temporary ID
          shop: shop,
          platform: 'Shopify',
          // status: 'successful',
          created_at: new Date().toISOString()
        }
        
        setIntegrations(prev => [...prev, newIntegration])
        setSelectedIntegration(newIntegration)
        
        // Also refresh from server to get the real ID
        await checkExistingIntegrations()
        
        toast({
          title: "Success",
          description: "Shopify store connected successfully!",
        })

      } catch (error) {
        console.error('❌ Error storing integration:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to complete Shopify integration. Please try again.",
        })
      } finally {
        setLoading(false)
        setIsProcessingRedirect(false)
      }
    }

    handleRedirectBack()
  }, []) // Remove dependencies to prevent infinite loop

  const handleDelete = async (integrationId: string) => {
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

      const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/delete_dataintegrations/${user}/${integrationId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to delete integration');

      // Immediately remove the integration from the local state
      setIntegrations(prevIntegrations => prevIntegrations.filter(integration => integration.id !== integrationId));

      // Clear selected integration if it was the one deleted
      if (selectedIntegration?.id === integrationId) {
        setSelectedIntegration(null)
      }

      toast({
        title: "Success",
        description: "Integration deleted successfully!",
      });

    } catch (error) {
      console.error('Error deleting integration:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete integration. Please try again.",
      });
    } finally {
      setIntegrationToDelete(null)
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
      
      {/* No Integrations State */}
      {integrations.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Image
              src="/shopify.svg"
              alt="Shopify Logo"
              width={64}
              height={64}
              className="object-contain mb-4 opacity-50"
            />
            <h3 className="text-lg font-medium mb-2">No Integrations Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Connect your first data source to start syncing products and data
            </p>
            <div className="w-full max-w-md space-y-4">
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
                ) : (
                  'Connect Your First Store'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Integration Card - Only show when there are existing integrations */}
      {integrations.length > 0 && !shopParamInUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Integration</CardTitle>
            <CardDescription>
              Connect a new Shopify store to sync products, customers, and orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Image
                  src="/shopify.svg"
                  alt="Shopify Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div className="flex-1">
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
                </div>
                <Button 
                  onClick={handleConnect}
                  className="bg-[#96bf48] hover:bg-[#85ab3f] text-white"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Connecting...
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integrations List */}
      {integrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Integrations</CardTitle>
            <CardDescription>
              Manage your connected data sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedIntegration?.id === integration.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedIntegration(integration)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Image
                        src="/shopify.svg"
                        alt="Shopify Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                      <div>
                        <h3 className="font-medium">{integration.shop}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{integration.platform}</span>
                          <span>•</span>
                          {/* <StatusBadge status={integration.status} /> */}
                        </div>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIntegrationToDelete(integration)
                          }}
                        >
                          <IconTrash size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-gray-900">Delete Integration</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Are you sure you want to delete the integration for {integration.shop}? This action cannot be undone and will remove all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setIntegrationToDelete(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => integrationToDelete && handleDelete(integrationToDelete.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Integration Details */}
      {selectedIntegration && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Integration Details</CardTitle>
              <CardDescription>
                {selectedIntegration.shop} - {selectedIntegration.platform}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Store:</span> {selectedIntegration.shop}
                </div>
                <div>
                  <span className="font-medium">Platform:</span> {selectedIntegration.platform}
                </div>
              
                <div>
                  <span className="font-medium">Connected:</span> {new Date(selectedIntegration.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

                     {/* Products Section - Only show if integration is successful */}
           
             <Card>
               <CardHeader>
                 <CardTitle>Products</CardTitle>
                 <CardDescription>View and manage your Shopify products from {selectedIntegration.shop}</CardDescription>
               </CardHeader>
                               <CardContent>
                  <ShopifyProducts integration={{ ...selectedIntegration, status: 'successful' }} />
                </CardContent>
             </Card>
           

          {/* Customers Section - Commented out as requested */}
          {/* {selectedIntegration.status === 'successful' && (
            <Card>
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>View and manage your Shopify customers from {selectedIntegration.shop}</CardDescription>
              </CardHeader>
              <CardContent>
                <ShopifyCustomers />
              </CardContent>
            </Card>
          )} */}
        </div>
      )}


    </div>
  )
}

