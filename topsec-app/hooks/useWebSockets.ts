"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

export function useWebSocket(eventKey: string) {
    // We use 'unknown' or a specific object instead of 'any'
    const [lastUpdate, setLastUpdate] = useState<Record<string, unknown> | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });
        }
        const socket = socketRef.current;

        const handleUpdate = (data: Record<string, unknown>) => {
            setLastUpdate(data);
        };

        socket.on(eventKey, handleUpdate);
        return () => { socket.off(eventKey, handleUpdate); };
    }, [eventKey]);

    return lastUpdate;
}