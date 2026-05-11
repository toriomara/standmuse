"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Как долго изготавливается заказ?",
    a: "Стандартный срок — 14 рабочих дней с момента подтверждения заказа и оплаты предоплаты. В период высокой загруженности срок уточняется отдельно.",
  },
  {
    q: "Как происходит доставка?",
    a: "Отправляем СДЭК, Почтой России или другой транспортной компанией по договорённости. Пара стоек в зависимости от исполнения весит от 15 до 35 кг — это крупный груз, упакованный с защитными материалами. Стоимость и сроки доставки рассчитываются по вашему адресу.",
  },
  {
    q: "Какие данные нужны для оформления заказа?",
    a: "Минимум — название модели акустики. Уточним размеры сами. Если модели нет в открытом доступе — понадобятся габариты основания колонки (ширина × глубина в мм). Всё остальное: высота, дерево, цвет металла — обсуждаем вместе.",
  },
  {
    q: "Можно ли заказать стойки под конкретную модель колонок?",
    a: "Да, это основной сценарий. Назовите модель — знаем размеры большинства популярных полочников. Платформа будет точно под ваши колонки.",
  },
  {
    q: "Как происходит оплата?",
    a: "Предоплата 50% при подтверждении заказа, остаток — перед отправкой. Принимаю переводы на карту (СБП). После оплаты предоплаты изделие уходит в производство.",
  },
  {
    q: "Можно ли внести изменения после оформления заказа?",
    a: "Да, в течение 1-2 дней после подтверждения. После запуска в производство изменение конструктивных параметров невозможно — начинается раскрой материала.",
  },
  {
    q: "Доставляете в другие города и регионы?",
    a: "Да, по всей России. Доставка в страны СНГ и ближнего зарубежья — по договорённости.",
  },
  {
    q: "Есть ли гарантия на изделия?",
    a: "Да. Гарантируем конструктивную целостность изделия и соответствие согласованным параметрам. При обнаружении производственного брака — замена или возврат.",
  },
  {
    q: "Можно ли посмотреть примеры похожих работ перед заказом?",
    a: "Да, в разделе «Примеры работ» собраны реализованные проекты с фото, материалами и описанием. Если хотите что-то конкретное — спросите в переписке, покажем больше.",
  },
  {
    q: "Из чего складывается цена?",
    a: "Цена зависит от размеров платформы и основания, породы дерева и сложности отделки. Базовая пара стоек под полочники — от 16 000 ₽. Заполните конфигуратор — пришлём точный расчёт в течение суток.",
  },
];

export function OrderFaqSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--accent)] mb-3 block">
              FAQ
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">
              Частые вопросы
            </h2>
            <p className="text-[var(--muted-foreground)]">
              Если не нашли ответ — напишите, ответим
            </p>
          </div>

          <Accordion.Root
            type="single"
            collapsible
            className="flex flex-col gap-2"
          >
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Accordion.Item
                  value={`item-${i}`}
                  className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)]"
                >
                  <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-[var(--muted)] transition-colors gap-3">
                    <span>{item.q}</span>
                    <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)] flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                  <Accordion.Content
                    className={cn(
                      "overflow-hidden text-sm text-[var(--muted-foreground)]",
                      "data-[state=open]:animate-[slideDown_200ms_ease-out]",
                      "data-[state=closed]:animate-[slideUp_200ms_ease-out]",
                    )}
                  >
                    <div className="px-5 pb-4 pt-2 leading-relaxed">
                      {item.a}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
