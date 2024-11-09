import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Plaza Moderna</h3>
            <div className="flex items-center space-x-4 mb-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-purple-400" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-purple-400" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-purple-400" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Cespedes, Camaguey, Cuba</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>+53 52489105</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>ronnytoledo87@proton.me</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Horario</h4>
            <p>Lunes a Sábado</p>
            <p className="mb-2">8:00 - 20:00</p>
            <p>Domingos y Festivos</p>
            <p>11:00 - 21:00</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-purple-400">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400">
                  Tiendas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400">
                  Eventos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2024 Plaza Moderna. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
