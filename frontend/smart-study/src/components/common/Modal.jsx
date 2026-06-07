import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/50
      backdrop-blur-sm
      p-4
      "
    >

      <div
        className="
        w-full
        max-w-lg
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        animate-in
        fade-in
        zoom-in-95
        duration-200
        "
      >

        {/* HEADER */}

        <div
          className="
          flex
          items-center
          justify-between
          px-6
          py-5
          border-b
          "
        >

          <h2
            className="
            text-2xl
            font-bold
            text-gray-800
            "
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
            w-10
            h-10
            rounded-xl
            hover:bg-gray-100
            transition
            text-xl
            font-bold
            "
          >
            ×
          </button>

        </div>

        {/* BODY */}

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

export default Modal;