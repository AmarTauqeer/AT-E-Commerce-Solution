import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FaFacebook, FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa"

const SocialMedia = () => {
    const socialLink = [
        {
            title: 'Youtube',
            href: 'https://www.youtube.com/',
            icon: <FaYoutube className="w-5 h-5" />
        },
        {
            title: 'Facebook',
            href: 'https://www.facebook.com/',
            icon: <FaFacebook className="w-5 h-5" />
        },
        {
            title: 'Github',
            href: 'https://github.com/',
            icon: <FaGithub className="w-5 h-5" />
        },
        {
            title: 'LinkedIn',
            href: 'https://www.linkedin.com/',
            icon: <FaLinkedin className="w-5 h-5" />
        },
    ]
    return (
        <div className="flex flex-row items-center gap-2">
            <TooltipProvider>
                {socialLink.map((s) => {
                    return (
                        <Tooltip key={s.title}>
                            <TooltipTrigger render={<Link href={s.href} target="_blank" className="text-md font-semibol rounded-full p-1">
                                {s.icon}
                            </Link>}>
                            </TooltipTrigger>
                            <TooltipContent className={cn("bg-white text-secondary font-semibold")}>
                                {s.title}
                            </TooltipContent>
                        </Tooltip>
                    )
                })
                }
            </TooltipProvider>

        </div>
    )
}

export default SocialMedia
