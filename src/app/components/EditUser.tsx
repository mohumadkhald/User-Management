/* eslint-disable react/no-direct-mutation-state */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import UserInterface from "../interface/user";

export const EditUser = ({ userID, setResUser }: { userID: any, setResUser: any }) => {
  const USER_API = "http://localhost:8080/api/v1/users";
  const [isOpen, setIsOpen] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null); // Ref to the pop-up div

  const [user, setUser] = useState<UserInterface>({
    id: userID,
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<UserInterface>>({});
  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>(
    {}
  );
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (userID != null) {
      fetch(`${USER_API}/${userID}`)
        .then((response) => response.json())
        .then((data) => {
          // Assuming data is an array and you want the first element
          const userData = data.data[0];
          if (!userData.hasOwnProperty("password")) {
            userData.password = ""; // Set a default value for password
          }
          setUser(userData);
          setIsOpen(true);
        //   console.log(userData);
        });
      // .catch((error) => console.error("Error fetching user:", error));
    }
  }, [userID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    validate(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validate(name, value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors({ ...errors, [name]: "" });
  };

  const validate = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "fname":
      case "lname":
      case "address":
        error = value.trim() === "" ? "This field is required" : "";
        break;
      case "email":
        error = value.trim() === "" ? "This field is required" : "";
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Invalid email address";
        break;
      case "phone":
        error = value.trim() === "" ? "This field is required" : "";
        error = /01[0-2,5,9]{1}[0-9]{8}$/.test(value)
          ? ""
          : "Phone number must invalid Egypt";
        break;
      case "password":
        error = value.trim() === "" ? "This field is required" : "";
        error = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value)
          ? ""
          : "Password must 8 character contain at least one digit, one lowercase and one uppercase letter";
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  let hasErrors = Object.values(errors).some((error) => error !== "");

  const updateUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    // Check if any field is empty or has errors
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (
      user.fname.trim() === "" ||
      user.lname.trim() === "" ||
      user.email.trim() === "" ||
      user.phone.trim() === "" ||
      user.address.trim() === "" ||
      user.password.trim() === "" ||
      hasErrors
    ) {
      const msg = {
        err: "Please fill in all fields correctly before submitting.",
      };
      setErrorMessage(msg);
      return; // Prevent form submission
    }

    // If all fields are filled correctly, clear the error message
    setErrorMessage({});

    const data = {
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phone: user.phone,
      address: user.address,
      password: user.password,
    };

    try {
      const response = await fetch(`${USER_API}/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Get the error message from the response body if available
        let errorMessages = {};
        const errorData = await response.json();
        if (errorData.errors && Object.keys(errorData.errors).length > 0) {
          errorMessages = errorData.errors; // Assign the error object directly
        }

        // Throw an error with HTTP status and response message
        setErrorMessage(errorMessages);
      }

      const responseData = await response.json();
      setResUser(responseData);
      setIsOpen(false);
      setSuccessMessage("User updated successfully.");
      setShowPopup(true);
      // Hide success message after 2 seconds
      //   setTimeout(() => {
      //     setSuccessMessage("");
      //   }, 2000);
    } catch (error) {
      // setErrorMessage({"err":"Error adding user. Please try again later."});
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener("click", handleClickOutside);
    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Function to handle clicks outside the pop-up
  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowPopup(false); // Close the pop-up if the click occurs outside of it
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
          <div
            ref={popupRef}
            className="relative bg-white rounded shadow-md"
            style={{ width: 450, height: 70, marginTop:"-34.5%" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white rounded shadow-md"></div>
            <div className="relative flex flex-col justify-between h-full">
              <div className=" bg-green-500 px-4 py-6 text-white mb-4">
                {successMessage}
              </div>
            </div>
          </div>
        </div>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-gray-900"
                  >
                    Edit User
                  </Dialog.Title>
                  <div className="flex max-w-md max-auto">
                    <div className="py-2 px-2">
                      <div className="h-14 my-5">
                        <label
                          htmlFor="fname"
                          className="block text-gray-600 text-sm font-normal"
                        >
                          Firstname
                        </label>
                        <input
                          id="fname"
                          onChange={(e) => handleChange(e)}
                          onBlur={(e) => handleBlur(e)}
                          onFocus={(e) => handleFocus(e)}
                          value={user.fname}
                          className="h-10 w-96 border mt-2 px-2 py-2"
                          name="fname"
                          type="text"
                        />
                        <div className="flex justify-end">
                          {errors.fname && (
                            <p className="text-red-500 text-xs mt-2">
                              {errors.fname}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-14 my-5">
                        <label
                          htmlFor="lname"
                          className="block text-gray-600 text-sm font-normal"
                        >
                          Lastname
                        </label>
                        <input
                          id="lname"
                          onChange={(e) => handleChange(e)}
                          onBlur={(e) => handleBlur(e)}
                          onFocus={(e) => handleFocus(e)}
                          value={user.lname}
                          className="h-10 w-96 border mt-2 px-2 py-2"
                          name="lname"
                          type="text"
                        />
                        <div className="flex justify-end">
                          {errors.lname && (
                            <p className="text-red-500 text-xs mt-2">
                              {errors.lname}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-14 my-5">
                        <label
                          htmlFor="phone"
                          className="block text-gray-600 text-sm font-normal"
                        >
                          Phone
                        </label>
                        <input
                          id="phone"
                          onChange={(e) => handleChange(e)}
                          onBlur={(e) => handleBlur(e)}
                          onFocus={(e) => handleFocus(e)}
                          value={user.phone}
                          className="h-10 w-96 border mt-2 px-2 py-2"
                          name="phone"
                          type="text"
                        />
                        <div className="flex justify-end">
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-14 my-5">
                        <label
                          htmlFor="address"
                          className="block text-gray-600 text-sm font-normal"
                        >
                          Address
                        </label>
                        <input
                          id="address"
                          onChange={(e) => handleChange(e)}
                          onBlur={(e) => handleBlur(e)}
                          onFocus={(e) => handleFocus(e)}
                          value={user.address}
                          className="h-10 w-96 border mt-2 px-2 py-2"
                          name="address"
                          type="text"
                        />
                        <div className="flex justify-end">
                          {errors.address && (
                            <p className="text-red-500 text-xs mt-2">
                              {errors.address}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-14 my-5">
                        <label
                          htmlFor="email"
                          className="block text-gray-600 text-sm font-normal"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          onChange={(e) => handleChange(e)}
                          onBlur={(e) => handleBlur(e)}
                          onFocus={(e) => handleFocus(e)}
                          value={user.email}
                          className="h-10 w-96 border mt-2 px-2 py-2"
                          name="email"
                          type="email"
                        />
                        <div className="flex justify-end">
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-2">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-14 my-5">
                        <label
                          htmlFor="password"
                          className="block text-gray-600 text-sm font-normal"
                        >
                          Password
                        </label>
                        <input
                          id="password"
                          onChange={(e) => handleChange(e)}
                          onBlur={(e) => handleBlur(e)}
                          onFocus={(e) => handleFocus(e)}
                          value={user.password}
                          className="h-10 w-96 border mt-2 px-2 py-2"
                          name="password"
                          type="password"
                        />
                        <div className="flex justify-start">
                          {errors.password && (
                            <p className="text-red-500 text-xs mt-2">
                              {errors.password}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 py-2 px-2 flex justify-center">
                    <button
                      type="button"
                      className={`w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                        hasErrors ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      onClick={(e) => updateUser(e)}
                      disabled={hasErrors}
                    >
                      Update
                    </button>
                  </div>
                  {errorMessage && (
                    <div className="text-red-500 text-md text-center mt-2">
                      <ul>
                        {Object.keys(errorMessage).map((key) => (
                          <li key={key}>{errorMessage[key]}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
