export function LoadingSkeleton() {
    return (
      <div className="w-full animate-pulse space-y-6">
        <div className="h-8 w-48 bg-muted rounded-md" />
        <div className="space-y-8">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="h-12 w-12 bg-muted rounded-full mx-auto" />
            <div className="h-4 w-48 bg-muted rounded-md mx-auto" />
            <div className="h-10 w-full bg-muted rounded-md" />
          </div>
          <div className="border rounded-lg p-6 space-y-4">
            <div className="h-6 w-32 bg-muted rounded-md" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-muted rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  