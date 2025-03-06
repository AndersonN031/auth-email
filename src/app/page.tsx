import { redirect } from "next/navigation";
import axios from "axios";
import { headers } from "next/headers";

export default async function Home() {
  try {
    const headersList = headers();
    const headersObject = Object.fromEntries((await headers()).entries());
    // Converter para objeto

    await axios.get(`${process.env.API_URL}/login`, {
      headers: headersObject, // Passa os headers corretamente
    });
  } catch (error) {
    console.error(error)
    redirect("/login")
  }

  return <h1>Hello World!</h1>
}
