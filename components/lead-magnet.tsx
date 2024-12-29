'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

export default function LeadMagnet() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 animate-in  duration-300">
      <Card className="w-full max-w-md mx-4 relative bg-white">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={handleClose}
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold" style={{ color: '#9e85b3' }}>
            Claim your free AI chatbot now!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                className="border-[#9e85b3] focus-visible:ring-[#9e85b3]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="Acme Inc."
                required
                className="border-[#9e85b3] focus-visible:ring-[#9e85b3]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="+1 (555) 000-0000"
                required
                className="border-[#9e85b3] focus-visible:ring-[#9e85b3]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                className="border-[#9e85b3] focus-visible:ring-[#9e85b3]"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-custom-button hover:bg-custom-button-hover text-white"
            >
              Download Now
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

