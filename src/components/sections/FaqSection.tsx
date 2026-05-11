"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { SectionTitle } from "@/components/shared/SectionTitle"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "Зачем нужны специальные стойки для акустики?",
    a: "Обычные полки и тумбочки передают вибрации от пола и мебели прямо в акустику. Это размывает бас и снижает детальность. Специальные стойки с виброразвязкой изолируют акустику и позволяют ей работать так, как задумал производитель.",
  },
  {
    q: "Зачем в стойках песок?",
    a: "Кварцевый песок внутри стальной колонны — это инертная масса. Он поглощает механические вибрации стойки, не позволяя им передаваться на акустику. 5 кг песка + стальная колонна = серьёзный демпфер.",
  },
  {
    q: "Что такое шипы и зачем они нужны?",
    a: "Шипы — это форма контакта стойки с полом. Острие шипа обеспечивает точечный жёсткий контакт, снижая площадь передачи вибраций. Результат — бас не «плавает», артикуляция улучшается.",
  },
  {
    q: "Почему дерево, а не только металл?",
    a: "Массив дерева обладает собственными демпфирующими свойствами и «звучит» иначе, чем металл. Основание из дуба или бука гасит высокочастотные резонансы, которые металл просто передаёт. Это комбинация, проверенная аудиофилами.",
  },
  {
    q: "Под любую акустику можно сделать?",
    a: "Да. Размеры платформы и основания — любые под ваш запрос. Вы указываете модель акустики, мы уточняем размеры и предлагаем оптимальную конфигурацию.",
  },
  {
    q: "Сколько стоит?",
    a: "Цена зависит от размеров, материала и сложности конфигурации. Укажите параметры в конфигураторе — пришлём точный расчёт в течение суток.",
  },
  {
    q: "Как долго ждать?",
    a: "Стандартный срок изготовления — 14 дней с момента подтверждения заказа и оплаты предоплаты.",
  },
  {
    q: "Как осуществляется доставка?",
    a: "Доставка СДЭК, Почтой России или другой транспортной компанией по договорённости. Каждая стойка упакована с защитой. Стоимость и сроки доставки уточняются при заказе.",
  },
  {
    q: "Почему дерево, а не МДФ?",
    a: "МДФ дешевле, но он «звонит». Массив дерева — плотный, инертный, не добавляет своих резонансов. Мы используем только сухую, камерной сушки древесину.",
  },
  {
    q: "Почему песок внутри?",
    a: "Песок — самый эффективный и доступный демпфер. Он «глушит» внутренние вибрации стоек, не давая им передаваться на акустику.",
  },
  {
    q: "Почему нет глянца?",
    a: "Лак и глянцевые покрытия — это плёнка, которая может резонировать. Масло и воск впитываются в дерево, оставляя его «дышащим» и акустически нейтральным.",
  },
  {
    q: "Как собирать?",
    a: "Всё продумано до мелочей: точная подгонка деталей, шипы с возможностью регулировки по высоте и выставления вертикали, комплектация «под ключ» — докупать ничего не нужно.",
  },
]

export function FaqSection() {
  return (
    <section className="py-14 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-24">
            <SectionTitle
              tag="FAQ"
              title="Ответы на частые вопросы"
              subtitle="Если не нашли ответ — напишите, ответим"
            />
          </div>

          <Accordion.Root type="single" collapsible className="flex flex-col gap-2">
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
                  <Accordion.Content className={cn(
                    "overflow-hidden text-sm text-[var(--muted-foreground)]",
                    "data-[state=open]:animate-[slideDown_200ms_ease-out]",
                    "data-[state=closed]:animate-[slideUp_200ms_ease-out]"
                  )}>
                    <div className="px-5 pb-4 pt-2 leading-relaxed">{item.a}</div>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  )
}
