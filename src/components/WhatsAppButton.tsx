import './WhatsAppButton.css'

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/5598985204721"
            target="_blank"
            className="whatsapp-button"
            aria-label="Falar no WhatsApp"
        >
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
        </a>
    )
}
