'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from "@components/ui/input"    
import { Button } from "@components/ui/Button"
import { IconCheck, IconClock } from "@tabler/icons-react"
import ShopifyProducts from '@components/ShopifyProducts'
import ShopifyCustomers from '@components/ShopifyCustomers'

export default function DataIntegrations() {
  const [shopifyUrl, setShopifyUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [integrationStatus, setIntegrationStatus] = useState('none') // 'none', 'pending', or 'successful'
  const [connectedShopName, setConnectedShopName] = useState('')

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

      const response = await fetch(`http://127.0.0.1:8000/api/users/get_dataintegrations/${user}/`)
      const data = await response.json()
      console.log('Integration data:', data)

      if (response.ok && data.dataintegrations && data.dataintegrations.length > 0) {
        const latestIntegration = data.dataintegrations[data.dataintegrations.length - 1]
        
        if (latestIntegration.status === 'successful') {
          setIntegrationStatus('successful')
          setConnectedShopName(latestIntegration.shop)
        } else if (latestIntegration.status === 'pending') {
          setIntegrationStatus('pending')
          setConnectedShopName(latestIntegration.shop)
          setShopifyUrl(latestIntegration.shop) // Pre-fill the input with pending shop URL
        } else {
          setIntegrationStatus('none')
        }
      }
    } catch (error) {
      console.error('Error checking existing integrations:', error)
    }
    setLoading(false)
  }

  const handleConnect = async () => {
    try {
      if (!shopifyUrl) {
        alert('Please enter your Shopify store URL')
        return
      }

      const state = crypto.randomUUID()
      sessionStorage.setItem('shopifyState', state)

      const user = localStorage.getItem('user')
      if (!user) {
        alert('Please log in to connect your store')
        return
      }

      const authUrl = `https://saudi-connecticut-scored-shanghai.trycloudflare.com/auth/login?shop=${shopifyUrl}&state=${state}`
    // const authUrl = `https://purpleberry-chatbot-404342c65d45.herokuapp.com/auth/login?shop=${shopifyUrl}&state=${state}`
      
      localStorage.setItem('pendingShopifyIntegration', JSON.stringify({
        shop: shopifyUrl,
        user: user
      }))

      window.location.href = authUrl

    } catch (error) {
      console.error('Error connecting Shopify store:', error)
      alert('Failed to connect Shopify store. Please try again.')
    }
  }

  useEffect(() => {
    const handleRedirectBack = async () => {
      const pendingIntegration = localStorage.getItem('pendingShopifyIntegration')
      
      if (pendingIntegration) {
        const { shop, user } = JSON.parse(pendingIntegration)
        
        try {
          const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/store_dataintegrations/${user}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shop: shop
            })
          })

          if (!response.ok) {
            throw new Error('Failed to store integration')
          }

          localStorage.removeItem('pendingShopifyIntegration')
          checkExistingIntegrations()

        } catch (error) {
          console.error('Error storing integration:', error)
          alert('Failed to complete Shopify integration. Please try again.')
        }
      }
    }

    handleRedirectBack()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#96bf48]"></div>
            <p className="text-gray-600">Checking existing integrations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Data Integrations</h1>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
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
              <div className="absolute -right-2 -top-2 bg-green-500 rounded-full p-1">
                <IconCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-green-600 font-medium">Shopify Connected Successfully</p>
            <p className="text-gray-600">Connected Store: {connectedShopName}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Image
                  src="/shopify-logo.png"
                  alt="Shopify Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
                {integrationStatus === 'pending' && (
                  <div className="absolute -right-2 -top-2 bg-yellow-500 rounded-full p-1">
                    <IconClock className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {integrationStatus === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                  <p className="text-yellow-800 text-sm">
                    Integration pending for {connectedShopName}. Click connect to continue the integration process.
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="shopify-url" className="block text-sm font-medium text-gray-700 mb-1">
                  Shopify Store URL
                </label>
                <Input
                  id="shopify-url"
                  type="text"
                  placeholder="your-store.myshopify.com"
                  value={shopifyUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShopifyUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={handleConnect}
                className="w-full bg-[#96bf48] hover:bg-[#85ab3f] text-white"
              >
                {integrationStatus === 'pending' ? 'Continue Integration' : 'Connect Shopify Store'}
              </Button>
            </div>
          </>
        )}
      </div>
      {integrationStatus === 'successful' && <ShopifyProducts />}
      {integrationStatus === 'successful' && <ShopifyCustomers />}
    </div>
  )
}