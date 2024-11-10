import HeaderClient from "@/components/header/headerClient";
import { auth } from "@/auth"

export default async function Header() {
    const session = await auth()

    return (
        <HeaderClient session={session}/>
    );
}
