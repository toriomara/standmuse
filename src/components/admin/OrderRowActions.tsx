import Link from "next/link"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { DeleteButton } from "@/components/admin/DeleteButton"

export function OrderRowActions({ id, contactName }: { id: string; contactName: string }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="ghost" size="icon">
        <Link href={`/admin/orders/${id}`} aria-label="Редактировать">
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <DeleteButton
        endpoint={`/api/orders/${id}`}
        label="Удалить заказ"
        title="Удалить заказ?"
        description={`Заказ от «${contactName}» будет удалён навсегда. Это действие необратимо.`}
      />
    </div>
  )
}
