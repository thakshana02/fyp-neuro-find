interface Prediction {
    id: number;
    image_url: string;
    prediction: string;
    confidence: number;
    created_at: string;
}

interface FetchResultsResponse {
    [key: string]: Prediction[]; 
}



import { useEffect, useState } from 'react';

function Results() {
    // Define the state with the type Prediction[]
    const [results, setResults] = useState<Prediction[]>([]);

    useEffect(() => {
        async function fetchResults() {
            const res = await fetch('/api/results');
            const data: FetchResultsResponse = await res.json();
            setResults(data.results); // 
        }

        fetchResults();
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Prediction</th>
                    <th>Confidence</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {results.map(result => (
                    <tr key={result.id}>
                        <td><img src={result.image_url} alt="Prediction" style={{ width: "100px" }} /></td>
                        <td>{result.prediction}</td>
                        <td>{result.confidence}%</td>
                        <td>{new Date(result.created_at).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Results;
