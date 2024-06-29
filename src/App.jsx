import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { mouseActivity, drawing } from "../src/app/reducer_action";
import { useEffect, useRef, useState } from "react";
import Absolutepositions from "./components/absolutepositions";
import Rectangle from "./components/Rectangle";
import axios from "axios";
const initialRectangles = [];
function App() {
  /* const [imageURL, setImageURL] = useState(null); */
  const [image, setImage] = useState(null);
  const imageURL = useSelector((state) => state.counter.image);
  useEffect(() => {
    if (imageURL) {
      const img = new window.Image();
      img.src = imageURL;
      img.onload = () => {
        setImage(img);
      };
    }
  }, [imageURL]);

  const drawRect = useSelector((state) => state.counter.drawRect);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const dispatch = useDispatch();
  const unlocked = useSelector((state) => state.counter.unlocked);
  const [annotationMenu, setAnnotationMenu] = useState(1);
  const mouseDivRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const selectionRectRef = useRef(null);

  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedId, selectShape] = useState(null);
  const fetchRectangles = async () => {
    try {
      const response = await axios.get("https://doom-to-drone-backend.vercel.app/annotations", {
        withCredentials: true,
      });
      const res = await response.data;
      setRectangles(response.data);
    } catch (error) {
      console.error("Error fetching rectangles:", error);
    }
  };

  useEffect(() => {
    fetchRectangles();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const rect = mouseDivRef.current.getBoundingClientRect();

      let dic = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      setMousePosition(dic);
      dispatch(mouseActivity(dic));
    };

    const mouseDiv = mouseDivRef.current;
    if (mouseDiv) {
      mouseDiv.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (mouseDiv) {
        mouseDiv.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [mousePosition, rectangles]);

  const postannotations = async (m) => {
    let response = await axios.post("https://doom-to-drone-backend.vercel.app/annotations", m, {
      withCredentials: true,
    });
    let res = await response.data;
  };
  const handleMouseUp = () => {
    if (isDragging) {
      delete selectionRectRef.current.fill;
      delete selectionRectRef.current.opacity;
      setIsDragging(false);

      setRectangles([...rectangles, selectionRectRef.current]);
      let m = selectionRectRef.current;
      let x = postannotations(m);
      selectionRectRef.current = null;
    }
  };
  const handleMouseMove = (e) => {
    if (isDragging) {
      const stage = e.target.getStage();
      const pointerPos = stage.getPointerPosition();

      const width = Math.abs(pointerPos.x - startPos.x);
      const height = Math.abs(pointerPos.y - startPos.y);
      selectionRectRef.current["width"] = width;
      selectionRectRef.current["height"] = height;
    }
  };
  const handleMouseDown = (e) => {
    if (drawRect) {
      setIsDragging(true);
      let dic = {
        x: e.evt.layerX,
        y: e.evt.layerY,
        stroke: "blue",
        strokeWidth: 2,
        id: "annotation" + (rectangles.length + 1),
        fill: "blue",
        opacity: 0.2,
      };

      selectionRectRef.current = dic;
      const stage = e.target.getStage();

      setStartPos(stage.getPointerPosition());
      dispatch(drawing());
    }
  };
  const handledelete = async () => {
    let response = await axios.delete(
      `https://doom-to-drone-backend.vercel.app/annotations/${selectedId}`,
      { withCredentials: true }
    );
    let res = await response.data;

    setRectangles(res);
  };

  return (
    <>
     <div className="bg-black min-h-[100vh] min-w-[100%]">
        <div
          className={`pt-3 grid ${
            annotationMenu ? "grid-col-1" : "grid-cols-4"
          }`}
        >
          <div
            ref={mouseDivRef}
            id="mouse"
            className="col-span-3 relative min-h-[95vh]"
          >
            {/* Annotation menu and absolute positions components */}
            {annotationMenu}

            <Absolutepositions />
            <div className="relative bg-slate-600 h-[90vh] mx-10">
              {/* Background Image */}

              {imageURL ? (
                <img
                  src={imageURL}
                  alt="Background"
                  className="absolute h-full"
                />
              ) : null}
              {/* Overlay */}
              {annotationMenu ? (
                <div className="absolute inset-0 bg-black opacity-50"></div>
              ) : null}

              {/* Stage Container */}
              <div className="relative z-10">
                <Stage
                  width={annotationMenu ? 1625 : 1200}
                  height={830}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                >
                  <Layer>
                    {/* Render selection rectangle if dragging  w-full h-full object-cover */}
                    {isDragging && (
                      <Rectangle shapeProps={selectionRectRef.current} />
                    )}

                    {/* Render rectangles */}
                     {imageURL
                      ? rectangles.map((rect, index) => {
                          return (
                            
                              <KonvaImage
                                key={index}
                                image={image}
                                
                                x={rect.x} 
                                y={rect.y} 
                                width={rect.width} 
                                height={rect.height} 
                                crop={{
                                  x: rect.x,
                                  y: rect.y,
                                  width: rect.width,
                                  height: rect.height,
                                
                                }} 
                              />
                            
                          );
                        })
                      : null}
 
                    {rectangles.map((rect, i) => (
                      <Rectangle
                        key={i}
                        annotationMenu={annotationMenu}
                        shapeProps={rect}
                        isSelected={rect.id === selectedId}
                        onSelect={() => {
                          if (rect.id === selectedId) {
                            

                            setAnnotationMenu(1);
                            selectShape(null);
                          } else {
                            
                            selectShape(rect.id);
                            setAnnotationMenu(0);
                          }
                        }}
                        onChange={(newAttrs) => {
                          const rects = rectangles.slice();
                          rects[i] = newAttrs;
                          setRectangles(rects);
                        }}
                      />
                    ))}
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>

          {annotationMenu ? null : (
            <div className={`col-span-1 bg-black`}>
              {annotationMenu}
              <div className="col-span-1 bg-gray-800 h-full p-4 rounded-lg shadow-md">
                <h2 className="text-lg text-white font-bold mb-4">
                  Annotation Details
                </h2>
                <div className="mb-4">
                  <label
                    htmlFor="annotationName"
                    className="block text-sm font-medium text-white"
                  >
                    Annotation Name
                  </label>
                  <input
                    type="text"
                    id="annotationName"
                    name="annotationName"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-white"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="rectangle">Rectangle</option>
                    <option value="square">Square</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="severityLevel"
                    className="block text-sm font-medium text-white"
                  >
                    Severity Level
                  </label>
                  <input
                    type="range"
                    id="severityLevel"
                    name="severityLevel"
                    min="1"
                    max="100"
                    className="mt-1 block w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-white"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="uniqueId"
                    className="block text-sm font-medium text-white"
                  >
                    Unique ID
                  </label>
                  <input
                    type="text"
                    id="uniqueId"
                    name="uniqueId"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="className"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Class Name
                  </label>
                  <input
                    type="text"
                    id="className"
                    name="className"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Save
                  </button>
                  <button
                    onClick={handledelete}
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Delete (it is working)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
