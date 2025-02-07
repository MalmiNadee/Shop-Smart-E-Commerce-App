import {useEffect, useState } from "react";

const useMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint)

    const handleResize = () => {
        const checkpoint = window.innerWidth < breakpoint
        setIsMobile(checkpoint)
    }

    useEffect (() => {
        handleResize()  //hook will run when this function called

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },)

    return [isMobile]
}

export default useMobile