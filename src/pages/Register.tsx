
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      <main className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Присоединяйтесь к PsyBalans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Имя</label>
              <Input placeholder="Ваше имя" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input type="email" placeholder="ваш@email.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Пароль</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500">
              Создать аккаунт
            </Button>
            <div className="text-center text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700">
                Войдите
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
