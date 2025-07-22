import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TopNavigation } from "@/components/layout/TopNavigation";
import GradientBackground from "@/components/background/GradientBackground";
import StarryBackground from "@/components/background/StarryBackground";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  date: string;
  time_slot: string;
  first_name: string;
  last_name: string;
  phone: string;
}

const timeSlots = [
  "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00",
  "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",
  "18:00-19:00", "19:00-20:00"
];

export default function Appointments() {
  const session = useAuthSession();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("date", format(selectedDate, "yyyy-MM-dd"));
      
      if (error) throw error;
      return data as Appointment[];
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: {
      date: string;
      time_slot: string;
      first_name: string;
      last_name: string;
      phone: string;
    }) => {
      const { data, error } = await supabase
        .from("appointments")
        .insert([appointmentData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setIsBookingModalOpen(false);
      setFirstName("");
      setLastName("");
      setPhone("");
      setSelectedTimeSlot("");
      toast({
        title: "¡Cita reservada!",
        description: "Tu cita ha sido reservada exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo reservar la cita. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleTimeSlotClick = (timeSlot: string) => {
    const isBooked = appointments.some(apt => apt.time_slot === timeSlot);
    if (!isBooked) {
      setSelectedTimeSlot(timeSlot);
      setIsBookingModalOpen(true);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    createAppointmentMutation.mutate({
      date: format(selectedDate, "yyyy-MM-dd"),
      time_slot: selectedTimeSlot,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
    });
  };

  const getBookedAppointment = (timeSlot: string) => {
    return appointments.find(apt => apt.time_slot === timeSlot);
  };

  return (
    <div className="min-h-screen relative">
      <GradientBackground colors={[
        { r: 17, g: 24, b: 39 },
        { r: 31, g: 41, b: 55 },
        { r: 17, g: 24, b: 39 },
      ]} />
      <StarryBackground />
      
      <div className="relative z-10">
        <TopNavigation session={session} />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full" />
              <h1 className="relative text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
                Sistema de Citas
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Reserva tu cita de manera fácil y rápida. Selecciona una fecha y horario disponible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Calendar Section */}
            <div className="lg:col-span-1">
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarIcon className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Seleccionar Fecha</h2>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date < new Date()}
                  className="rounded-2xl border-0"
                />
              </div>
            </div>

            {/* Time Slots Section */}
            <div className="lg:col-span-2">
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">
                    Horarios - {format(selectedDate, "dd/MM/yyyy")}
                  </h2>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {timeSlots.map((_, index) => (
                      <div key={index} className="h-24 bg-muted/50 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {timeSlots.map((timeSlot) => {
                      const bookedAppointment = getBookedAppointment(timeSlot);
                      const isBooked = !!bookedAppointment;
                      
                      return (
                        <div
                          key={timeSlot}
                          onClick={() => handleTimeSlotClick(timeSlot)}
                          className={cn(
                            "relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer group",
                            isBooked
                              ? "bg-muted/70 border-muted text-muted-foreground cursor-not-allowed"
                              : "bg-gradient-to-br from-card/80 to-card/60 border-primary/20 hover:border-primary/40 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                          )}
                        >
                          <div className="text-center">
                            <div className="text-lg font-bold mb-2">
                              {timeSlot.split("-")[0]}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {timeSlot.split("-")[1]}
                            </div>
                            
                            {isBooked ? (
                              <div className="space-y-1">
                                <div className="flex items-center justify-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span className="text-xs font-medium">
                                    {bookedAppointment.first_name} {bookedAppointment.last_name}
                                  </span>
                                </div>
                                <div className="flex items-center justify-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <span className="text-xs">
                                    {bookedAppointment.phone}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-primary/80 font-medium">
                                Disponible
                              </div>
                            )}
                          </div>
                          
                          {!isBooked && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Reservar Cita - {selectedTimeSlot}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Teléfono
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Tu número de teléfono"
                required
                className="bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createAppointmentMutation.isPending}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                {createAppointmentMutation.isPending ? "Reservando..." : "Reservar Cita"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}