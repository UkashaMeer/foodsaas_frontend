import { useQuery } from "@tanstack/react-query";
import BannerSlider from "./BannerSlider";
import { getItems } from "@/api/items/getItems";
import { toast } from "sonner";
import ItemCard from "./ItemCard";
import ItemDialog from "./ItemDialog";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

const slides = [
    { src: "/banner-1.jpg", alt: "Delicious pizza" },
    { src: "/banner-2.jpg", alt: "Tasty burger", },
    { src: "/banner-3.jpg", alt: "Healthy bowl", },
];

export default function HomePageComponent() {

    const { data, isPending, isSuccess, isError, error } = useQuery({
        queryKey: ["items"],
        queryFn: getItems,
    })

    const [open, setOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const handleDialog = (item) => {
        setSelectedItem(item)
        setOpen(true)
    }

    if (isError) {
        toast.error("Failed to load items." || error)
    }

    return (
        <main className="">
            <BannerSlider slides={slides} height="h-[420px]" autoplay interval={4000} />

            {
                isPending ? (
                    <div className="w-full min-h-[50vh] flex flex-col gap-2 items-center justify-center">
                        <Spinner className="size-8 text-primary" />
                        <span className="text-primary text-lg font-semibold">Loading Items...</span>
                    </div>
                ) : (
                    <div>
                        {
                            isSuccess && (
                                <div className="max-w-[1140px] mx-auto p-4">
                                    {data?.categories?.map((category) => (
                                        <div key={category._id} className="my-8">
                                            <h2 className="text-2xl font-bold">{category.name}</h2>
                                            <p className="text-gray-600 mb-6">{category.description}</p>
                                            <img
                                                className="rounded-md border-primary border-2 max-sm:mb-2"
                                                src={category?.images[0]}
                                                alt=""
                                            />

                                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto py-6 max-sm:p-0 max-sm:gap-3 max-md:p-4">
                                                {category.items.map((item) => (
                                                    <div key={item._id}>
                                                        <ItemCard data={item} onClick={handleDialog} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            )
                        }
                        <ItemDialog open={open} setOpen={setOpen} item={selectedItem} />
                    </div>
                )
            }
        </main>
    );
}
