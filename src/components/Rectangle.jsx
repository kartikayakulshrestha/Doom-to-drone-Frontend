import React, { useEffect, useRef, Fragment, useState } from "react";
import { Rect, Transformer, Group, Text } from "react-konva";
import { useSelector } from "react-redux";
import axios from "axios";
const Rectangle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  annotationMenu,
}) => {
  const unlocked = useSelector((state) => state.counter.unlocked);

  const shapeRef = useRef();
  const trRef = useRef();
  const [position, setPosition] = useState({
    x: shapeProps.x,
    y: shapeProps.y,
  });
  const draggingupdates = async (props) => {
    let response = await axios.put(
      `https://doom-to-drone-backend.vercel.app/annotations/${props.id}`,
      props,
      { withCredentials: true }
    );
  };
  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <div>
      <Fragment>
        <Group>
          <Rect
            onClick={onSelect}
            onTap={isSelected ? (onSelect = false) : onSelect}
            ref={shapeRef}
            {...shapeProps}
            draggable={unlocked}
            dragBoundFunc={(pos) => ({
              x: Math.max(Math.min(pos.x, annotationMenu ? 1525 : 1100), 0),
              y: Math.max(Math.min(pos.y, 635), 0),
            })}
            onDragEnd={(e) => {
              setPosition({ x: e.target.x(), y: e.target.y() });
              onChange({
                ...shapeProps,
                x: e.target.x(),
                y: e.target.y(),
              });
              let x = draggingupdates({
                ...shapeProps,
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            onTransformEnd={(e) => {
              const node = shapeRef.current;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();

              node.scaleX(1);
              node.scaleY(1);
              onChange({
                ...shapeProps,
                x: node.x(),
                y: node.y(),

                width: Math.max(5, node.width() * scaleX),
                height: Math.max(node.height() * scaleY),
              });
              let x = draggingupdates({
                ...shapeProps,
                x: node.x(),
                y: node.y(),

                width: Math.max(5, node.width() * scaleX),
                height: Math.max(node.height() * scaleY),
              });
            }}
          />
          <Text
            x={position.x}
            y={position.y - 15} // Adjust this value to position the text correctly
            text={shapeProps.id}
            fontSize={14}
            width={100}
            fill={"white"}
            fontStyle="bold"
            wrap="true"
            draggable={unlocked}
          />

          {isSelected && (
            <Transformer
              ref={trRef}
              flipEnabled={false}
              boundBoxFunc={(oldBox, newBox) => {
                // limit resize
                if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Group>
      </Fragment>
    </div>
  );
};

export default Rectangle;
