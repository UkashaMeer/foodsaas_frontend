"use client"

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Clock, ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function Footer() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const socialLinks = [
        { icon: Facebook, label: 'Facebook', href: '#' },
        { icon: Twitter, label: 'Twitter', href: '#' },
        { icon: Instagram, label: 'Instagram', href: '#' },
        { icon: Linkedin, label: 'LinkedIn', href: '#' }
    ];

    const quickLinks = [
        { label: 'Terms and Conditions', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'FAQs', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Become a Franchisee', href: '#' },
        { label: 'Sitemap', href: '#' }
    ];

    return (
        <>
            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`cursor-pointer bg-primary shadow-md fixed bottom-8 right-8 z-50 p-2 rounded-md transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                    }`}
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-5 h-5 text-white relative z-10" />
            </button>

            <div className="max-w-[1140px] w-full mx-auto px-4 sm:px-6 pt-20 pb-4 relative z-10 text-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Company Info */}
                    <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <img src="/logo.png" className='w-28' alt="" />

                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Revolutionizing the food industry with innovative SaaS solutions for restaurants and food businesses.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            {[
                                { Icon: Phone, label: 'Phone', value: '+92 234 1821623', href: 'tel:+922341821623' },
                                { Icon: Mail, label: 'Email', value: 'info@foodsaas.biz', href: 'mailto:info@foodsaas.biz' },
                                { Icon: MapPin, label: 'Address', value: 'Food SAAS Bahadurabad, Bahadur Yar Jang CHS, Bahadurabad, Karachi' }
                            ].map(({ Icon, label, value, href }, i) => (
                                <div key={i} className="flex items-start gap-3 group cursor-pointer">
                                    <div className="p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 bg-sidebar-accent">
                                        <Icon className="w-4 h-4 text-sidebar-accent-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">{label}</p>
                                        {href ? (
                                            <a href={href} className="text-sm font-semibold hover:text-orange-500 transition-colors">
                                                {value}
                                            </a>
                                        ) : (
                                            <p className="text-sm font-semibold">{value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h5 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            Our Timings
                        </h5>
                        <div className="space-y-3">
                            {[
                                { day: 'Monday - Friday', time: '11:00 AM - 02:00 AM' },
                                { day: 'Saturday - Sunday', time: '11:00 AM - 03:00 AM' },
                            ].map(({ day, time }, i) => (
                                <div key={i} className="p-4 rounded-xl bg-sidebar-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    <p className="text-sm font-medium text-primary mb-1">{day}</p>
                                    <p className="text-lg font-bold">{time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <h5 className="text-lg font-semibold">Quick Links</h5>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="group flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:translate-x-2"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300 group-hover:w-5"></span>
                                        <span className="group-hover:text-orange-500">{link.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social & Newsletter */}
                    <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h5 className="text-lg font-semibold">Follow Us</h5>
                        <div className="flex gap-3">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="group relative p-2.5 rounded-xl bg-sidebar-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                                >
                                    <social.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                                    <div className="absolute inset-0 bg-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <social.icon className="w-5 h-5 absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </a>
                            ))}
                        </div>

                        <div className="pt-2">
                            <p className="text-sm font-medium mb-2">Subscribe to Our Newsletter</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full sm:flex-1"
                                />
                                <Button className="w-full sm:w-auto">Join</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-4 mt-8 border-t border-border animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs md:text-sm text-muted-foreground">
                            © 2025 Food SAAS. Powered by <span className="font-semibold text-primary">Invenzee</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                                        style={{ animationDelay: `${i * 0.2}s` }}
                                    ></div>
                                ))}
                            </div>
                            <p className="md:text-sm text-xs text-muted-foreground">Crafted by Ukasha</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}