import React from "react";
import { List } from "antd";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { DragOutlined } from "@ant-design/icons";

const EditableDraggableList = ({
  id,
  data,
  onChange,
  editData,
  ItemComponent,
}: {
  id: string;
  data: any[];
  onChange: (data: any[]) => void;
  editData: boolean;
  ItemComponent: (props: any) => React.ReactNode;
}) => {
  // 处理拖动结束的逻辑
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newData = Array.from(data);
    const [reorderedItem] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, reorderedItem);

    onChange(newData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <List
              bordered
              dataSource={data}
              size="small"
              renderItem={(item, index) => (
                <Draggable
                  draggableId={`draggable-${id}-${index}`}
                  index={index}
                  isDragDisabled={!editData}
                >
                  {(provided, snapshot) => (
                    <>
                      <List.Item
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        extra={
                          editData && (
                            <DragOutlined
                              style={{
                                marginLeft: 10,
                              }}
                            />
                          )
                        }
                      >
                        <ItemComponent value={item}></ItemComponent>
                      </List.Item>
                      {snapshot.isDragging && (
                        <div>
                          <List.Item style={{ visibility: "hidden" }}>
                            <ItemComponent value={item} />
                          </List.Item>
                        </div>
                      )}
                    </>
                  )}
                </Draggable>
              )}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default EditableDraggableList;
