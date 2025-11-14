"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, MessageCircle } from "lucide-react"

export function WhatsAppBotButton() {
  const botUrl = process.env.NEXT_PUBLIC_BOT_URL || "http://localhost:4000"

  const handleOpenBot = () => {
    window.open(botUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleOpenBot}
          className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-medium shadow-md hover:shadow-lg transition-all"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Abrir Bot de WhatsApp
        </Button>
      </div>      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
        <span className="text-[#1C1C1C]/70 flex-shrink-0">URL del bot:</span>
        <a
          href={botUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#25D366] hover:underline font-medium flex items-center gap-1 min-w-0 break-all"
        >
          <span className="truncate">{botUrl}</span>
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </a>
      </div>

      <p className="text-sm text-[#1C1C1C]/60">
        Haz clic para abrir el bot de WhatsApp en una nueva pestaña. Asegúrate de que el bot esté corriendo.
      </p>
    </div>
  )
}
