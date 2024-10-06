export default function (...classes) {
    return classes.filter(Boolean).join(' ')
}
