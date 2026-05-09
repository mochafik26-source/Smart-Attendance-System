"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function Badge({ onChange, val }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("present");
  useEffect(() => {
    setValue(val);
  }, [val]);
  const options = ["waiting", "present", "Absent", "Redirected"];

  return (
    <StyledWrapper className="flex justify-center">
      <div className="dropdown">
        <button className="button" onClick={() => setOpen(!open)}>
          <span className="label">{value}</span>
        </button>

        {open && (
          <div className="menu">
            {options.map((item) => (
              <div
                key={item}
                className="item"
                onClick={() => {
                  setValue(item);
                  onChange(item);
                  setOpen(false);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .dropdown {
    position: relative;
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px 12px;
    gap: 8px;
    height: 36px;
    width: 120px;
    border: none;
    background: #5e41de33;
    border-radius: 20px;
    cursor: pointer;
  }

  .label {
    line-height: 20px;
    font-size: 17px;
    color: #5d41de;
    font-family: sans-serif;
    letter-spacing: 1px;
  }

  .button:hover {
    background: #5e41de4d;
  }

  .menu {
    position: absolute;
    top: 45px;
    width: 120px;
    background: #1f1f21;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 3;
  }

  .item {
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
  }

  .item:hover {
    background: #f0f0f0;
  }
`;
