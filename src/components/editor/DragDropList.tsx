import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Section } from '@/lib/types'
import SectionEditor from './SectionEditor'

interface Props {
  sections: Section[]
  onReorder: (sections: Section[]) => void
  onUpdateSection: (id: string, updates: Partial<Section>) => Promise<void>
  onDeleteSection: (id: string) => Promise<void>
}

export default function DragDropList({
  sections,
  onReorder,
  onUpdateSection,
  onDeleteSection,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id)
      const newIndex = sections.findIndex((s) => s.id === over.id)
      const newOrder = arrayMove(sections, oldIndex, newIndex)
      onReorder(newOrder)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onUpdate={(updates) => onUpdateSection(section.id, updates)}
              onDelete={() => onDeleteSection(section.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableSection({
  section,
  onUpdate,
  onDelete,
}: {
  section: Section
  onUpdate: (updates: Partial<Section>) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SectionEditor section={section} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  )
}
