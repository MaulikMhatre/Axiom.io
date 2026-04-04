const API_BASE_URL = "http://localhost:8000";

export async function fetchGitHubProfile(username: string) {
    const res = await fetch(`${API_BASE_URL}/api/github/${username}`);
    if (!res.ok) throw new Error("Failed to fetch GitHub profile");
    return res.json();
}

export async function uploadResume(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE_URL}/api/upload-resume`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload resume");
    return res.json();
}

export async function verifyCertificate(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE_URL}/api/verify-certificate`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to verify certificate");
    return res.json();
}

export async function analyzeRepo(url: string, mode: string = "standard") {
    const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, mode }),
    });
    if (!res.ok) throw new Error("Failed to analyze repository");
    return res.json();
}

export async function fetchLeetCodeProfile(username: string, email?: string) {
    const url = new URL(`${API_BASE_URL}/api/leetcode/${username}`);
    if (email) url.searchParams.append("email", email);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch LeetCode profile");
    return res.json();
}

export async function fetchMe(email: string) {
    const res = await fetch(`${API_BASE_URL}/api/me?email=${email}`);
    if (!res.ok) throw new Error("Failed to fetch user profile data");
    return res.json();
}
