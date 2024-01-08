import React, { useState } from "react";
import { Button, Card, Flex, message, Space } from "antd";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { DragOutlined } from "@ant-design/icons";

const ActionButtons = ({ data, index, onChange, ...rest }) => {
  const handleCopy = (event) => {
    event.stopPropagation();
    const newData = [...data];
    const item = newData[index];
    newData.splice(index + 1, 0, item);
    onChange?.(newData);
    message.success(
      `复制成功，已将第 ${index + 1} 项复制插入到第 ${index + 2} 项`,
    );
  };

  const handleMoveUp = (event) => {
    event.stopPropagation();
    const newData = [...data];
    const item = newData[index];
    newData.splice(index, 1);
    newData.splice(index - 1, 0, item);
    onChange?.(newData);
    message.success(`上移成功，已将第 ${index + 1} 项与第 ${index} 项交换`);
  };

  const handleMoveDown = (event) => {
    event.stopPropagation();
    const newData = [...data];
    const item = newData[index];
    newData.splice(index, 1);
    newData.splice(index + 1, 0, item);
    onChange?.(newData);
    message.success(`下移成功，已将第 ${index + 1} 项与第 ${index + 2} 项交换`);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    const newData = [...data];
    newData.splice(index, 1);
    onChange?.(newData);
    message.success(`删除成功，已删除第 ${index + 1} 项`);
  };

  return (
    <Space {...rest}>
      <Button size="small" onClick={handleCopy}>
        复制
      </Button>
      <Button size="small" onClick={handleMoveUp} disabled={index === 0}>
        上移
      </Button>
      <Button
        size="small"
        onClick={handleMoveDown}
        disabled={index === data.length - 1}
      >
        下移
      </Button>
      <Button size="small" danger onClick={handleDelete}>
        删除
      </Button>
    </Space>
  );
};

const EditableDraggableList = ({
  id,
  data,
  onChange,
  editData,
  ItemComponent,
  path = [],
  allData,
}: {
  id: string;
  data: any[];
  onChange: (data: any[]) => void;
  editData: boolean;
  ItemComponent: (props: any) => React.ReactNode;
  path: (string | number)[];
  allData: any;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  // 处理拖动结束的逻辑
  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    if (!result.destination) {
      return;
    }

    const newData = Array.from(data);
    const [reorderedItem] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, reorderedItem);

    onChange(newData);
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <Droppable droppableId={id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Card bordered size="small">
              <Flex vertical gap={8}>
                {data.map((item, index) => (
                  <Draggable
                    draggableId={`draggable-${id}-${index}`}
                    index={index}
                    isDragDisabled={!editData}
                    key={index}
                  >
                    {(provided, snapshot) => (
                      <>
                        <Flex
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ItemComponent
                            value={item}
                            onChange={(value) => {
                              const newData = [...data];
                              newData[index] = value;
                              onChange?.(newData);
                            }}
                            path={[...path, index]}
                            allData={allData}
                          />
                          {editData && (
                            <>
                              <ActionButtons
                                style={{
                                  marginLeft: 10,
                                }}
                                data={data}
                                index={index}
                                onChange={onChange}
                              />
                              <DragOutlined
                                style={{
                                  marginLeft: 10,
                                }}
                              />
                            </>
                          )}
                        </Flex>
                        {snapshot.isDragging && (
                          <Flex
                            style={{
                              opacity: 0.3,
                              marginBottom: 8,
                            }}
                          >
                            <ItemComponent value={item} />
                            {editData && (
                              <>
                                <ActionButtons
                                  data={data}
                                  index={index}
                                  onChange={onChange}
                                />
                                <DragOutlined
                                  style={{
                                    marginLeft: 10,
                                  }}
                                />
                              </>
                            )}
                          </Flex>
                        )}
                      </>
                    )}
                  </Draggable>
                ))}
                {isDragging && (
                  <Flex
                    style={{
                      visibility: "hidden",
                    }}
                  >
                    <ItemComponent value={data[data.length - 1]} />
                  </Flex>
                )}
              </Flex>
            </Card>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default EditableDraggableList;
