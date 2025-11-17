"use client";

import { store } from "@/redux/store";
/* eslint-disable */

import React from "react";

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import VerifyUser from "./UserVerify";

export const WrapperLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <Provider store={store}>
        <VerifyUser/>
        <Toaster position="top-center" />
        {children}
        </Provider>
      
    </div>
  );
};
