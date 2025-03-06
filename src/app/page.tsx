import { redirect } from "next/navigation";
import axios from "axios";
import { headers } from "next/headers";
import { LogoutButton } from "@/components/logout/logout";

export default async function Home() {
  try {
    const headersObject = Object.fromEntries((await headers()).entries());
    // Converter para objeto

    await axios.get(`${process.env.API_URL}/login`, {
      headers: headersObject, // Passa os headers corretamente
    });
  } catch (error) {
    console.error(error)
    redirect("/login")
  }

  return (
    <>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)"
        }}>


        {/* Overlay para melhorar legibilidade do texto */}
        < div className="absolute inset-0 bg-black opacity-50" ></div >

        {/* Conteúdo principal */}
        < div className="relative z-10 text-center p-6" >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            Bem-vindo à sua Jornada!
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
            Explore um mundo de possibilidades e descubra o que há além do horizonte.
          </p>

          {/* Botão de Logout */}


          {/* Lorem Ipsum para preenchimento */}
          <div className="max-w-3xl mx-auto text-gray-200">
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="mb-4">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
            </p>
          </div>
          <div className="mb-8">
            <LogoutButton />
          </div>
        </div >

        {/* Animação sutil no fundo */}
        < div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" ></div >
      </div >
    </>
  )
}
