import { Skeleton } from './ui/skeleton'

const FetchingDataSkeleton = () => {
    return (
        <div className="mt-5 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
}

export default FetchingDataSkeleton
