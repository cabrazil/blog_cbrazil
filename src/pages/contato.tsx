import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';

export default function Contato() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validarEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    if (!form.nome || !form.email || !form.mensagem) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (!validarEmail(form.email)) {
      setErro('E-mail inválido.');
      return;
    }
    setEnviado(true);
    setForm({ nome: '', email: '', mensagem: '' });
  }

  return (
    <>
      <Head>
        <title>Contato - CBrazil Blog</title>
        <meta name="description" content="Entre em contato com o CBrazil Blog" />
      </Head>
      <Header />
      <main className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
        <div className="flex justify-center items-center mb-8">
          <div className="relative w-[800px] h-[400px]">
            <Image
              src="/images/contact.png"
              alt="Contato"
              fill
              className="object-cover object-center rounded-lg shadow-xl"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center gap-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 text-center">Fale comigo</h1>
          <p className="text-gray-600 text-center mb-4">Se deseja entrar em contato comigo, apenas preencha o formulário abaixo para enviar sua mensagem.</p>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              placeholder="Seu nome"
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.nome}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Seu e-mail"
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="mensagem"
              placeholder="Sua mensagem"
              className="border border-gray-300 rounded-md px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-500"
              value={form.mensagem}
              onChange={handleChange}
              required
            />
            {erro && <p className="text-red-500 text-sm">{erro}</p>}
            {enviado && <p className="text-green-600 text-sm">Mensagem enviada com sucesso!</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md px-6 py-2 font-semibold hover:bg-blue-700 transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
} 