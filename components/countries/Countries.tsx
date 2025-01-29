"use client";

import { useEffect, useState } from "react";

export default function Countries() {
    const [countries, setCountries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch("/countries");
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error("Error fetching countries: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCountries();
    }, [])

    if (loading) return <p>Loading...</p>

    return <pre>{JSON.stringify(countries, null, 2)}</pre>;
}