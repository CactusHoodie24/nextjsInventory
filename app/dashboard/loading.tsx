import SkeletonAppBar from "@/components/skeletonCard";

 export default function loading() {
    return (
        <div className="flex justify-center items-center h-screen ml-[230px]">
                <SkeletonAppBar  />
        </div>
    )
}