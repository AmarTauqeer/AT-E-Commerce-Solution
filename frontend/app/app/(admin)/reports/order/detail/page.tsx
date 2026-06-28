'use client'
import { getOrderDetailView } from "@/app/services/order"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CustomerOrderDetailReport } from "@/components/order/order-detail-between-dates"
import { useRouter } from "next/navigation"
import { PDFViewer } from "@react-pdf/renderer"
import { FaLessThanEqual } from "react-icons/fa6"

const OrderDetailBetweenDates = () => {
    const [from, setFrom] = useState<Date>()
    const [to, setTo] = useState<Date>()
    const [data, setData] = useState([])
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter()

    function formatDate(date: any) {
        return (
            String(date.getDate()).padStart(2, "0") +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getFullYear()).slice(-2)
        );
    }

    // console.log(formatDate(new Date()));

    async function handlePrint() {
        setLoading(true);
        if (from != undefined && to != undefined) {
            const date1 = formatDate(from)
            const date2 = formatDate(to)
            const response = await getOrderDetailView(date1, date2)
            console.log(response)
            setData(response)
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex flex-row item-center gap-3 mb-5">
                <Popover open={openFrom} onOpenChange={setOpenFrom}>
                    <PopoverTrigger render={<Button variant={"outline"} data-empty={!from} className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground">{from ? format(from, "PPP") : <span>Pick a date</span>}<ChevronDownIcon data-icon="inline-end" /></Button>} />
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={from}
                            onSelect={(selectedDate) => { setFrom(selectedDate); setOpenFrom(false) }}
                            defaultMonth={from}
                        />
                    </PopoverContent>
                </Popover>
                <Popover open={openTo} onOpenChange={setOpenTo}>
                    <PopoverTrigger render={<Button variant={"outline"} data-empty={!to} className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground">{to ? format(to, "PPP") : <span>Pick a date</span>}<ChevronDownIcon data-icon="inline-end" /></Button>} />
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={to}
                            onSelect={(selectedDate) => { setTo(selectedDate); setOpenTo(false) }}
                            defaultMonth={to}
                        />
                    </PopoverContent>
                </Popover>
                {loading?"Processing...":<Button type="button" onClick={handlePrint}>Print</Button> }
                
            </div>
            {loading ? "Processing..." : <span>{
                data.length > 0 &&

                    <PDFViewer
                        style={{
                            width: "100%",
                            height: "100vh",
                        }}
                    >

                        <CustomerOrderDetailReport
                            orders={data} fromDate={formatDate(from)} toDate={formatDate(to)}
                        />
                    </PDFViewer>
            }</span>}



            {/* {data.length > 0 && <CustomerOrderDetailReport orders={data} fromDate={formatDate(from)} toDate={formatDate(to)} />} */}
        </>

    )
}

export default OrderDetailBetweenDates
