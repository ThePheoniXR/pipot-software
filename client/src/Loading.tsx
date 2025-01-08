import "./Loading.css"
import { useEffect } from "react"

export default function Loading() {
    useEffect(() => {
        const water = document.querySelector('.waterFilled') as HTMLElement | null;
        const pi = document.querySelector('.pi') as HTMLElement | null;
        const pot = document.querySelector('.pot') as HTMLElement | null;

        setTimeout(() => {
            water!.style.height = "100%"
        }, 500)

        setTimeout(() => {
            pi!.style.marginLeft = "-150px";
        }, 3500)
        setTimeout(() => {
            pot!.style.opacity = "1"
        }, 3800)

    }, [])
    return (
        <div id="screen">
            <h1 className="pi">π</h1>
            <div className="waterFilled"></div>
            <h1 className="pot">Pot</h1>
        </div>
    )
}
