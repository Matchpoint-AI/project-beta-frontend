interface NavButtonProps {
    href: string;
    text: string;
    onClick?: (e?: any) => void;
}
declare const NavButton: ({ href, text, onClick }: NavButtonProps) => any;
export default NavButton;
