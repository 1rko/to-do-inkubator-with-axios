import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from "react"

type Props = {
  id: string,
  children: ReactNode,
}

export const SortableItem = ({ id, children }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    /*padding: '10px',*/
    margin: '5px 0',
   /* background: '#f0f0f0',*/
   /* border: '1px solid #ccc',*/
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} style={{ flexGrow: 1, cursor: 'grab', width: '100%', height: '100%', position: 'absolute' }}>

      </div>
      {children}
    </div>
  );
};