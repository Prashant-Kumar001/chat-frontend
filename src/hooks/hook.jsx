import { useState, useEffect } from "react";
import toast from "react-hot-toast"
const useError = (error = []) => {
    useEffect(() => {  
        error.forEach(({ isError, error, fallback }) => {
            if (isError) {
                if (fallback) {
                    toast.error(`${error?.data?.message || "something went"}`)
                    fallback()
                } else {
                    toast.error(`${error?.data?.message || "something went"}`)
                }
            }
        })
    }, [error])
}


function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}


const useSocketEvents = (socket, handlers) => {
    useEffect(() => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.on(event, handler);
      });
  
      return () => {
        Object.entries(handlers).forEach(([event, handler]) => {
          socket.off(event, handler);
        });
      };
    }, [socket, handlers]);
  };



const useMutationAsyncMutation = (mutationFunction) => {
  const [loading, setLoading] = useState(false);

  const executeMutation = async ({ payload, loadingMessage, successMessage, errorMessage, onSuccess }) => {
    const toastId = toast.loading(loadingMessage);
    setLoading(true);
    try {
      const response = await mutationFunction(payload).unwrap(); 
      toast.success(successMessage || response?.data?.message || "created successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(error?.data?.message || errorMessage);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return { executeMutation, loading };
};



export {
    useError,
    useDebounce,
    useSocketEvents,
    useMutationAsyncMutation
}