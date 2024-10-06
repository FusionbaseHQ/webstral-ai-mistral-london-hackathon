import Container from "../Layout/Container";
import Link from "next/link";

export default function Footer({ children }) {
    return (
        <footer className="flex-grow-0 border-t justify-center border-muted dark:border-mutedDark">
            <Container>
                <div className="flex justify-end items-center py-3 space-x-4 text-sm">
                    <span>powered by</span>
                    <Link className="text-sm font-medium hover:text-primary cursor-pointer" href="https://mistral.ai/">
                        Mistral AI
                    </Link>
                    <Link className="text-sm font-medium hover:text-primary cursor-pointer" href="https://brave.com/">
                        Brave
                    </Link>
                    <Link className="text-sm font-medium hover:text-primary cursor-pointer" href="https://fusionbase.com/">
                        Fusionbase
                    </Link>
                </div>
            </Container>
        </footer>
    )
}