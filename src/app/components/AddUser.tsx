"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import UserList from "./UserList";

const AddUser = () => {
  const USER_API = "http://localhost:8080/api/v1/users";
  let [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [resUser, setResUser] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    // Validate on change
    validate(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validate(name, value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    // Clear errors when focusing on the input field
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

  // Check if there are any errors
  let hasErrors = Object.values(errors).some((error) => error !== "");
  const handleSubmit = async (
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
      const msg = {"err":"Please fill in all fields correctly before submitting."};
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
      const response = await fetch(USER_API, {
        method: "POST",
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
      setSuccessMessage("User added successfully.");
      // Hide success message after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      // setErrorMessage({"err":"Error adding user. Please try again later."});
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
      <div className="container mx-auto my-8">
        {successMessage && (
          <div className="flex h-2 justify-center">
            <p
              style={{ width: 500, height: 50 }}
              className="bg-green-500 py-2 text-white font-semibold text-2XL text-center mt-2"
            >
              {successMessage}
            </p>
          </div>
        )}
        <div className="h-12 flex justify-end">
          <button
            onClick={openModal}
            className="rounded bg-slate-600 text-white px-6 py-2 font-semibold"
          >
            Add User
          </button>
        </div>
      </div>
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
                    Add User
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
                      onClick={(e) => handleSubmit(e)}
                      disabled={hasErrors}
                    >
                      Create
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
      <UserList user={resUser}></UserList>
    </>
  );
};

export default AddUser;
