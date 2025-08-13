import { useState, useEffect, useRef } from "react";
import { apiService, User, Analytics, Event as DBEvent, TeamMember, Advisor, CityData, Registration } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";

interface Event {
  _id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  category: "Debate" | "MUN" | "Workshop" | "Speaker Session" | "Social Impact";
  status: "Upcoming" | "Ongoing" | "Completed";
  image?: string;
  registrationLink?: string;
}

interface VisitorStats {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  averageSessionDuration: string;
}

interface TextBlock {
  _id?: string;
  title: string;
  value: string;
}

interface ImageAsset {
  _id?: string;
  title: string;
  url: string;
  alt?: string;
  part?: string;
  file?: File | null;
  event?: string;
  date?: string;
  location?: string;
  category?: string;
}

const ADMIN_SECTIONS = [
  { key: "team", label: "Team Members" },
  { key: "events", label: "Events" },
  { key: "images", label: "Images" },
  { key: "texts", label: "Texts" },
  { key: "advisors", label: "Advisors" },
  { key: "gallery", label: "Gallery" },
  { key: "contactSubmissions", label: "Contact Submissions", icon: Mail },
  { key: "password", label: "Change Password" },
];

const IMAGE_PARTS = [
  "Homepage Hero 1",
  "Homepage Hero 2",
  "Homepage Hero 3",
  "Team Photo",
  "Footer Logo",
  "Gallery",
  "Board of Advisors",
  "Events Section",
  "Contact Section",
];

export default function Admin() {
  // --- OTP Password Change State and Handlers ---
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSendStatus, setOtpSendStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [otpChangeError, setOtpChangeError] = useState("");
  const [otpChangeSuccess, setOtpChangeSuccess] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("tpc_token"));
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [section, setSection] = useState("team");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Text Blocks State ---
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [isLoadingTexts, setIsLoadingTexts] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextValue, setEditingTextValue] = useState("");
  const [textError, setTextError] = useState<string | null>(null);

  // --- Images State ---
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<ImageAsset>({ title: "", alt: "", part: "", url: "", file: null });
  const [imageError, setImageError] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<ImageAsset>({ title: "", alt: "", part: "", url: "", file: null });

  // --- Events State ---
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DBEvent | null>(null);
  const [eventForm, setEventForm] = useState<Partial<DBEvent> & { imageFile?: File | null }>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    participants: 0,
    category: '',
    status: 'Upcoming',
    imageFile: null,
    registrationLink: '',
  });

  // --- Team Members State ---
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState<Partial<TeamMember> & { imageFile?: File | null }>({
    name: '',
    position: '',
    description: '',
    city: '',
    core: false,
    imageFile: null,
  });

  // --- Cities State ---
  const [cities, setCities] = useState<CityData[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);
  const [showCityDialog, setShowCityDialog] = useState(false);
  const [editingCity, setEditingCity] = useState<CityData | null>(null);
  const [cityForm, setCityForm] = useState<Partial<CityData> & { imageFile?: File | null }>({
    name: '',
    image: '',
    studentCount: 0,
    registrationLink: '',
    isActive: true,
    imageFile: null,
  });

  // --- Advisors State ---
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoadingAdvisors, setIsLoadingAdvisors] = useState(false);
  const [advisorError, setAdvisorError] = useState<string | null>(null);
  const [advisorFilter, setAdvisorFilter] = useState<'all' | 'board' | 'interaction'>('all');
  const [showAdvisorDialog, setShowAdvisorDialog] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);
  const [advisorForm, setAdvisorForm] = useState<Partial<Advisor> & { imageFile?: File | null }>({
    name: '',
    title: '',
    organization: '',
    description: '',
    expertise: [],
    imageFile: null,
    isInteraction: false,
  });

  // --- Gallery State ---
  const [galleryImages, setGalleryImages] = useState<ImageAsset[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [editingGalleryImage, setEditingGalleryImage] = useState<ImageAsset | null>(null);
  const [galleryForm, setGalleryForm] = useState<Partial<ImageAsset> & { file?: File; youtube?: string }>({
    title: '',
    alt: '',
    url: '',
    part: 'Gallery',
    event: '',
    date: '',
    location: '',
    category: '',
    file: null,
  });

  // --- Contact Submissions State ---
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [isLoadingContactSubmissions, setIsLoadingContactSubmissions] = useState(false);
  const [contactSubmissionsError, setContactSubmissionsError] = useState<string | null>(null);

  // --- Cooldown Effect ---
  useEffect(() => {
    if (otpCooldown > 0) {
      cooldownTimer.current = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
    }
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, [otpCooldown]);

  // --- Fetch Data on Section Change ---
  useEffect(() => {
    if (section === "texts") fetchTextBlocks();
    if (section === "images") fetchImages();
    if (section === "events") fetchEvents();
    if (section === "team") {
      fetchTeamMembers();
      fetchCities();
    }
    if (section === "advisors") fetchAdvisors();
    if (section === "gallery") fetchGalleryImages();
    if (section === "contactSubmissions") fetchContactSubmissions();
  }, [section]);

  // --- OTP Handlers ---
  const handleSendOtp = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsSendingOtp(true);
    setOtpSendStatus(null);
    setOtpChangeError("");
    setOtpChangeSuccess("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("tpc_token");
      const res = await fetch(`${apiUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setOtpSent(true);
      setOtpSendStatus({ success: true, message: "OTP sent to official.turningpointcommunity@gmail.com" });
      setOtpCooldown(60);
    } catch (err: any) {
      setOtpSendStatus({ success: false, message: err.message || "Failed to send OTP" });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = handleSendOtp;

  const handleOtpPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpChangeError("");
    setOtpChangeSuccess("");
    if (!otp || otp.length !== 6) {
      setOtpChangeError("Please enter the 6-digit OTP.");
      return;
    }
    if (!newPassword || !confirmNewPassword) {
      setOtpChangeError("Please enter and confirm the new password.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setOtpChangeError("Passwords do not match.");
      return;
    }
    setIsChangingPassword(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("tpc_token");
      const res = await fetch(`${apiUrl}/api/auth/verify-otp-and-change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      setOtpChangeSuccess("Password changed successfully.");
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
      setOtpSendStatus(null);
    } catch (err: any) {
      setOtpChangeError(err.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // --- Fetch Handlers ---
  const fetchTextBlocks = async () => {
    setIsLoadingTexts(true);
    setTextError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/admin/texts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("tpc_token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch texts");
      setTextBlocks(await res.json());
    } catch (err: any) {
      setTextError(err.message || "Failed to fetch texts");
    } finally {
      setIsLoadingTexts(false);
    }
  };

  const fetchImages = async () => {
    setIsLoadingImages(true);
    setImageError(null);
    try {
      const images = await apiService.getImages();
      setImages(images);
    } catch (err: any) {
      setImageError(err.message || "Failed to fetch images");
    } finally {
      setIsLoadingImages(false);
    }
  };

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    setEventError(null);
    try {
      const data = await apiService.getEvents();
      setEvents(data);
    } catch (err: any) {
      setEventError(err.message || 'Failed to fetch events');
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchTeamMembers = async () => {
    setIsLoadingTeam(true);
    setTeamError(null);
    try {
      const data = await apiService.getTeamMembers();
      setTeamMembers(data);
    } catch (err: any) {
      setTeamError(err.message || 'Failed to fetch team members');
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const fetchCities = async () => {
    setIsLoadingCities(true);
    setCityError(null);
    try {
      const data = await apiService.getAdminCities();
      setCities(data);
    } catch (err: any) {
      setCityError(err.message || 'Failed to fetch cities');
    } finally {
      setIsLoadingCities(false);
    }
  };

  const fetchAdvisors = async () => {
    setIsLoadingAdvisors(true);
    setAdvisorError(null);
    try {
      const data = await apiService.getAdvisors();
      setAdvisors(data);
    } catch (err: any) {
      setAdvisorError(err.message || 'Failed to fetch advisors');
    } finally {
      setIsLoadingAdvisors(false);
    }
  };

  const fetchGalleryImages = async () => {
    setIsLoadingGallery(true);
    setGalleryError(null);
    try {
      const images = await apiService.getImages();
      setGalleryImages(images.filter((img: ImageAsset) => img.part === 'Gallery'));
    } catch (err: any) {
      setGalleryError(err.message || 'Failed to fetch gallery images');
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const fetchContactSubmissions = async () => {
    setIsLoadingContactSubmissions(true);
    setContactSubmissionsError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/contact-submissions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("tpc_token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch contact submissions");
      setContactSubmissions(await res.json());
    } catch (err: any) {
      setContactSubmissionsError(err.message || "Failed to fetch contact submissions");
    } finally {
      setIsLoadingContactSubmissions(false);
    }
  };

  // --- Text Handlers ---
  const handleEditText = (block: TextBlock) => {
    setEditingTextId(block._id!);
    setEditingTextValue(block.value);
  };

  const handleCancelEditText = () => {
    setEditingTextId(null);
    setEditingTextValue("");
  };

  const handleSaveEditText = async (block: TextBlock) => {
    setTextError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/admin/texts/${block._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("tpc_token")}`,
        },
        body: JSON.stringify({ title: block.title, value: editingTextValue }),
      });
      if (!res.ok) throw new Error("Failed to update text block");
      setEditingTextId(null);
      setEditingTextValue("");
      fetchTextBlocks();
    } catch (err: any) {
      setTextError(err.message || "Failed to update text block");
    }
  };

  // --- Image Handlers ---
  const handleEditImage = (img: ImageAsset) => {
    setEditingImageId(img._id!);
    setEditingImage({ ...img, file: null });
  };

  const handleCancelEditImage = () => {
    setEditingImageId(null);
    setEditingImage({ title: "", alt: "", part: "", url: "", file: null });
  };

  const handleSaveEditImage = async (id: string) => {
    setImageError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const formData = new FormData();
      if (editingImage.file) {
        formData.append("file", editingImage.file);
      }
      formData.append("title", editingImage.title);
      formData.append("alt", editingImage.alt);
      formData.append("part", editingImage.part || "");
      const res = await fetch(`${apiUrl}/api/admin/images/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tpc_token")}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update image");
      setEditingImageId(null);
      setEditingImage({ title: "", alt: "", part: "", url: "", file: null });
      fetchImages();
    } catch (err: any) {
      setImageError(err.message || "Failed to update image");
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/admin/images/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tpc_token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete image");
      fetchImages();
    } catch (err: any) {
      setImageError(err.message || "Failed to delete image");
    }
  };

  const handleUploadImage = async () => {
    if (!newImage.file) {
      setImageError("Please select a file to upload.");
      return;
    }
    if (!newImage.part) {
      setImageError("Please select a part for the image.");
      return;
    }
    if (!newImage.title) {
      setImageError("Please enter a title for the image.");
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL;
    const formData = new FormData();
    formData.append("file", newImage.file);
    formData.append("title", newImage.title);
    formData.append("alt", newImage.alt);
    formData.append("part", newImage.part);
    try {
      const res = await fetch(`${apiUrl}/api/admin/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tpc_token")}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image");
      setNewImage({ title: "", alt: "", part: "", url: "", file: null });
      fetchImages();
    } catch (err: any) {
      setImageError(err.message || "Failed to upload image");
    }
  };

  // --- Event Handlers ---
  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      participants: 0,
      category: '',
      status: 'Upcoming',
      imageFile: null,
      registrationLink: '',
    });
    setShowEventDialog(true);
  };

  const handleOpenEditEvent = (event: DBEvent) => {
    setEditingEvent(event);
    setEventForm({ ...event, imageFile: null });
    setShowEventDialog(true);
  };

  const handleCloseEventDialog = () => {
    setShowEventDialog(false);
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      participants: 0,
      category: '',
      status: 'Upcoming',
      imageFile: null,
      registrationLink: '',
    });
  };

  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setEventForm((prev) => ({ ...prev, imageFile: (e.target as HTMLInputElement).files?.[0] || null }));
    } else {
      setEventForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEvent = async () => {
    setEventError(null);
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'category', 'status'];
    for (const field of requiredFields) {
      if (!eventForm[field]) {
        setEventError(`Please fill in the ${field} field.`);
        return;
      }
    }
    try {
      const formData = new FormData();
      requiredFields.forEach((field) => formData.append(field, eventForm[field] || ''));
      if (eventForm.imageFile) {
        formData.append('image', eventForm.imageFile);
      }
      if (eventForm.registrationLink) {
        formData.append('registrationLink', eventForm.registrationLink);
      }
      if (editingEvent && editingEvent._id) {
        await apiService.updateEventWithFormData(editingEvent._id, formData);
      } else {
        await apiService.createEventWithFormData(formData);
      }
      fetchEvents();
      handleCloseEventDialog();
    } catch (err: any) {
      setEventError(err.message || 'Failed to save event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setEventError(null);
    try {
      await apiService.deleteEvent(id);
      fetchEvents();
    } catch (err: any) {
      setEventError(err.message || 'Failed to delete event');
    }
  };

  // --- Team Handlers ---
  const handleOpenAddTeam = () => {
    setEditingTeamMember(null);
    setTeamForm({
      name: '',
      position: '',
      description: '',
      city: '',
      core: false,
      imageFile: null,
    });
    setShowTeamDialog(true);
  };

  const handleOpenEditTeam = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamForm({
      name: member.name,
      position: member.position,
      description: member.description || '',
      city: member.city || '',
      core: member.core || false,
    });
    setShowTeamDialog(true);
  };

  const handleCloseTeamDialog = () => {
    setShowTeamDialog(false);
    setEditingTeamMember(null);
    setTeamForm({
      name: '',
      position: '',
      description: '',
      city: '',
      core: false,
      imageFile: null,
    });
  };

  const handleTeamFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'file') {
      setTeamForm((prev) => ({ ...prev, imageFile: (e.target as HTMLInputElement).files?.[0] || null }));
    } else if (type === 'checkbox') {
      setTeamForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setTeamForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveTeamMember = async () => {
    setTeamError(null);
    if (!teamForm.name || !teamForm.name.trim() || !teamForm.position || !teamForm.position.trim()) {
      setTeamError('Name and position are required and cannot be empty.');
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const formData = new FormData();
      formData.append('name', teamForm.name.trim());
      formData.append('position', teamForm.position.trim());
      formData.append('description', teamForm.description || '');
      formData.append('city', teamForm.city || '');
      formData.append('core', teamForm.core ? 'true' : 'false');
      if (teamForm.imageFile) formData.append('image', teamForm.imageFile);
      if (editingTeamMember && editingTeamMember._id) {
        await apiService.updateTeamMemberWithFormData(editingTeamMember._id, formData);
      } else {
        await apiService.createTeamMemberWithFormData(formData);
      }
      fetchTeamMembers();
      handleCloseTeamDialog();
    } catch (err: any) {
      setTeamError(err.message || 'Failed to save team member');
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    setTeamError(null);
    try {
      await apiService.deleteTeamMember(id);
      fetchTeamMembers();
    } catch (err: any) {
      setTeamError(err.message || 'Failed to delete team member');
    }
  };

  // --- City Handlers ---
  const handleOpenAddCity = () => {
    setEditingCity(null);
    setCityForm({
      name: '',
      image: '',
      studentCount: 0,
      registrationLink: '',
      isActive: true,
      imageFile: null,
    });
    setShowCityDialog(true);
  };

  const handleOpenEditCity = (city: CityData) => {
    setEditingCity(city);
    setCityForm({
      name: city.name,
      image: city.image,
      studentCount: city.studentCount,
      registrationLink: city.registrationLink || '',
      isActive: city.isActive,
      imageFile: null,
    });
    setShowCityDialog(true);
  };

  const handleCloseCityDialog = () => {
    setShowCityDialog(false);
    setEditingCity(null);
    setCityForm({
      name: '',
      image: '',
      studentCount: 0,
      registrationLink: '',
      isActive: true,
      imageFile: null,
    });
  };

  const handleCityFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (type === 'file') {
      setCityForm((prev) => ({ ...prev, imageFile: (e.target as HTMLInputElement).files?.[0] || null }));
    } else if (type === 'checkbox') {
      setCityForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'studentCount') {
      setCityForm((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setCityForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveCity = async () => {
    setCityError(null);
    if (!cityForm.name || !cityForm.name.trim()) {
      setCityError('City name is required.');
      return;
    }
    if (!editingCity && !cityForm.imageFile) {
      setCityError('City image is required.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', cityForm.name.trim());
      formData.append('studentCount', cityForm.studentCount?.toString() || '0');
      formData.append('registrationLink', cityForm.registrationLink || '');
      formData.append('isActive', cityForm.isActive ? 'true' : 'false');
      if (cityForm.imageFile) {
        formData.append('image', cityForm.imageFile);
      }
      if (editingCity && editingCity._id) {
        await apiService.updateCityWithFormData(editingCity._id, formData);
      } else {
        await apiService.createCityWithFormData(formData);
      }
      fetchCities();
      handleCloseCityDialog();
    } catch (err: any) {
      setCityError(err.message || 'Failed to save city');
    }
  };

  const handleDeleteCity = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;
    setCityError(null);
    try {
      await apiService.deleteCity(id);
      fetchCities();
    } catch (err: any) {
      setCityError(err.message || 'Failed to delete city');
    }
  };

  // --- Advisor Handlers ---
  const handleOpenAddAdvisor = () => {
    setEditingAdvisor(null);
    setAdvisorForm({
      name: '',
      title: '',
      organization: '',
      description: '',
      expertise: [],
      imageFile: null,
      isInteraction: false,
    });
    setShowAdvisorDialog(true);
  };

  const handleOpenEditAdvisor = (advisor: Advisor) => {
    setEditingAdvisor(advisor);
    setAdvisorForm({
      name: advisor.name,
      title: advisor.title,
      organization: advisor.organization || '',
      description: advisor.description || '',
      expertise: advisor.expertise || [],
      imageFile: null,
      isInteraction: advisor.isInteraction || false,
    });
    setShowAdvisorDialog(true);
  };

  const handleCloseAdvisorDialog = () => {
    setShowAdvisorDialog(false);
    setEditingAdvisor(null);
    setAdvisorForm({
      name: '',
      title: '',
      organization: '',
      description: '',
      expertise: [],
      imageFile: null,
    });
  };

  const handleAdvisorFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === 'file') {
      setAdvisorForm((prev) => ({ ...prev, imageFile: (e.target as HTMLInputElement).files?.[0] || null }));
    } else if (type === 'checkbox') {
      setAdvisorForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setAdvisorForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdvisorExpertiseChange = (value: string) => {
    setAdvisorForm((prev) => ({ ...prev, expertise: value.split(',').map((s) => s.trim()).filter(Boolean) }));
  };

  const handleSaveAdvisor = async () => {
    setAdvisorError(null);
    if (!advisorForm.name || !advisorForm.name.trim() || !advisorForm.title || !advisorForm.title.trim()) {
      setAdvisorError('Name and title are required and cannot be empty.');
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const formData = new FormData();
      formData.append('name', advisorForm.name.trim());
      formData.append('title', advisorForm.title.trim());
      formData.append('organization', advisorForm.organization || '');
      formData.append('description', advisorForm.description || '');
      formData.append('expertise', (advisorForm.expertise || []).join(','));
      formData.append('isInteraction', advisorForm.isInteraction ? 'true' : 'false');
      if (advisorForm.imageFile) formData.append('image', advisorForm.imageFile);
      if (editingAdvisor && editingAdvisor._id) {
        await apiService.updateAdvisorWithFormData(editingAdvisor._id, formData);
      } else {
        await apiService.createAdvisorWithFormData(formData);
      }
      fetchAdvisors();
      handleCloseAdvisorDialog();
    } catch (err: any) {
      setAdvisorError(err.message || 'Failed to save advisor');
    }
  };

  const handleDeleteAdvisor = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this advisor?')) return;
    setAdvisorError(null);
    try {
      await apiService.deleteAdvisor(id);
      fetchAdvisors();
    } catch (err: any) {
      setAdvisorError(err.message || 'Failed to delete advisor');
    }
  };

  // --- Gallery Handlers ---
  const handleOpenAddGallery = () => {
    setEditingGalleryImage(null);
    setGalleryForm({ title: '', alt: '', url: '', part: 'Gallery', file: null, youtube: '' });
    setShowGalleryDialog(true);
  };

  const handleOpenEditGallery = (img: ImageAsset) => {
    setEditingGalleryImage(img);
    setGalleryForm({ ...img, file: null, youtube: '' });
    setShowGalleryDialog(true);
  };

  const handleCloseGalleryDialog = () => {
    setShowGalleryDialog(false);
    setEditingGalleryImage(null);
    setGalleryForm({ title: '', alt: '', url: '', part: 'Gallery', file: null, youtube: '' });
  };

  const handleGalleryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setGalleryForm((prev) => ({ ...prev, file: files?.[0] }));
    } else {
      setGalleryForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveGalleryImage = async () => {
    setGalleryError(null);
    if (!galleryForm.title || !galleryForm.title.trim()) {
      setGalleryError('Title is required.');
      return;
    }
    const hasYouTube = galleryForm.youtube && galleryForm.youtube.trim() !== '';
    const hasFile = !!galleryForm.file;
    if (!hasYouTube && !hasFile) {
      setGalleryError('Please provide either a YouTube video link or select an image file.');
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const formData = new FormData();
      formData.append('title', galleryForm.title.trim());
      formData.append('alt', galleryForm.alt || '');
      formData.append('part', 'Gallery');
      formData.append('event', galleryForm.event || '');
      formData.append('date', galleryForm.date || '');
      formData.append('location', galleryForm.location || '');
      formData.append('category', galleryForm.category || '');
      if (galleryForm.file) formData.append('file', galleryForm.file);
      if (galleryForm.youtube && galleryForm.youtube.trim() !== '') {
        formData.append('youtube', galleryForm.youtube.trim());
      }
      if (editingGalleryImage && editingGalleryImage._id) {
        await fetch(`${apiUrl}/api/admin/images/${editingGalleryImage._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${localStorage.getItem('tpc_token')}` },
          body: formData,
        });
      } else {
        await fetch(`${apiUrl}/api/admin/images`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('tpc_token')}` },
          body: formData,
        });
      }
      fetchGalleryImages();
      handleCloseGalleryDialog();
    } catch (err: any) {
      setGalleryError(err.message || 'Failed to save gallery image');
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery image?')) return;
    setGalleryError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/api/admin/images/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('tpc_token')}` },
      });
      fetchGalleryImages();
    } catch (err: any) {
      setGalleryError(err.message || 'Failed to delete gallery image');
    }
  };

  // --- Authentication Handlers ---
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const fixedEmail = "admin@example.com";
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fixedEmail, password: passwordInput }),
      });
      if (!res.ok) {
        setError("Incorrect password");
        return;
      }
      const data = await res.json();
      localStorage.setItem("tpc_token", data.token);
      setIsAuthenticated(true);
      setPasswordInput("");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    logout();
    navigate("/login");
  };

  // --- Render ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handlePasswordSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-xs flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2 text-center">Admin Login</h2>
          <input
            type="password"
            className="border p-2 rounded"
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="bg-red-900 text-white py-2 rounded hover:bg-red-800">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => window.innerWidth >= 768 && setSidebarOpen(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setSidebarOpen(false)}
        className={`fixed top-0 left-0 h-screen z-30 bg-white border-r transition-all duration-300 flex-col justify-between flex ${sidebarOpen ? "w-64" : "w-16"} md:flex ${sidebarOpen ? "md:w-64" : "md:w-16"} w-16`}
      >
        <nav className="flex flex-col gap-2 mt-16">
          {ADMIN_SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`flex items-center gap-3 text-left px-4 py-2 rounded-lg font-medium transition-colors ${section === s.key ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              onClick={() => setSection(s.key)}
              title={s.label}
            >
              {s.key === "texts" && <span>📝</span>}
              {s.key === "images" && <span>🖼️</span>}
              {s.key === "events" && <span>📅</span>}
              {s.key === "team" && <span>👥</span>}
              {s.key === "advisors" && <span>🎓</span>}
              {s.key === "gallery" && <span>🖼️</span>}
              {s.key === "password" && <span>🔒</span>}
              <span className={`hidden md:inline ${sidebarOpen ? "" : "md:hidden"}`}>{s.label}</span>
            </button>
          ))}
        </nav>
        <button
          className={`mt-8 px-4 py-2 rounded-lg bg-red-900 text-white font-semibold hover:bg-red-800 transition-colors mb-8 mx-4 ${!sidebarOpen ? "justify-center px-2" : ""}`}
          onClick={handleLogoutClick}
          title="Logout"
        >
          <span>🚪</span>
          <span className={`hidden md:inline ${sidebarOpen ? "" : "md:hidden"}`}>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"} p-6`}>
        {/* Texts Section */}
        {section === "texts" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Texts</h2>
            <p className="mb-4">Edit site text blocks here.</p>
            {textError && <div className="text-red-500 mb-2">{textError}</div>}
            {isLoadingTexts ? (
              <div>Loading...</div>
            ) : (
              <>
                <div className="space-y-4 md:hidden">
                  {textBlocks.map((block) => (
                    <div key={block._id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
                      <div className="font-semibold">{block.title}</div>
                      <div className="text-gray-700 mb-2">
                        {editingTextId === block._id ? (
                          <Input
                            value={editingTextValue}
                            onChange={e => setEditingTextValue(e.target.value)}
                          />
                        ) : (
                          block.value
                        )}
                      </div>
                      <div className="flex gap-2 self-end">
                        {editingTextId === block._id ? (
                          <>
                            <Button size="sm" onClick={() => handleSaveEditText(block)}>Save</Button>
                            <Button size="sm" variant="secondary" onClick={handleCancelEditText}>Cancel</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleEditText(block)}>Edit</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Table className="hidden md:table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {textBlocks.map((block) => (
                      <TableRow key={block._id}>
                        <TableCell>{block.title}</TableCell>
                        <TableCell>
                          {editingTextId === block._id ? (
                            <Input
                              value={editingTextValue}
                              onChange={e => setEditingTextValue(e.target.value)}
                            />
                          ) : (
                            block.value
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTextId === block._id ? (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSaveEditText(block)}>Save</Button>
                              <Button size="sm" variant="secondary" onClick={handleCancelEditText}>Cancel</Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleEditText(block)}>Edit</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        )}

        {/* Images Section */}
        {section === "images" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Images</h2>
            <p className="mb-4">Manage all images for the website. You can see, edit, or delete any image below.</p>
            {imageError && <div className="text-red-500 mb-2">{imageError}</div>}
            {isLoadingImages ? (
              <div>Loading...</div>
            ) : (
              <>
                <div className="space-y-4 md:hidden">
                  {images.filter(img => img.part !== 'Gallery').map((img) => {
                    const isEditing = editingImageId === img._id;
                    return (
                      <div key={img._id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-4 mb-2">
                          <img src={img.url.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL}${img.url}` : img.url} alt={img.alt} className="w-16 h-16 object-cover rounded border" />
                          <div>
                            <div className="font-semibold text-sm">{img.part}</div>
                            <div className="text-xs text-gray-500">{img.title}</div>
                          </div>
                        </div>
                        <div className="text-gray-700 text-xs mb-2">
                          <span className="font-medium">Alt:</span> {isEditing ? (
                            <Input
                              value={editingImage.alt}
                              onChange={e => setEditingImage({ ...editingImage, alt: e.target.value })}
                              placeholder="Alt text"
                              className="mt-1"
                            />
                          ) : (
                            img.alt
                          )}
                        </div>
                        <div className="text-gray-700 text-xs mb-2">
                          <span className="font-medium">Title:</span> {isEditing ? (
                            <Input
                              value={editingImage.title}
                              onChange={e => setEditingImage({ ...editingImage, title: e.target.value })}
                              placeholder="Title"
                              className="mt-1"
                            />
                          ) : (
                            img.title
                          )}
                        </div>
                        <div className="flex gap-2 self-end">
                          {isEditing ? (
                            <>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={e => setEditingImage({ ...editingImage, file: e.target.files?.[0] || null })}
                                className="w-32"
                              />
                              <Button size="sm" onClick={() => handleSaveEditImage(img._id!)}>Save</Button>
                              <Button size="sm" variant="secondary" onClick={handleCancelEditImage}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEditImage(img)}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(img._id!)}>Delete</Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Table className="hidden md:table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Preview</TableHead>
                      <TableHead>Part</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Alt</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {images.filter(img => img.part !== 'Gallery').map((img) => {
                      const isEditing = editingImageId === img._id;
                      return (
                        <TableRow key={img._id}>
                          <TableCell>
                            <img src={img.url.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL}${img.url}` : img.url} alt={img.alt} className="w-16 h-16 object-cover rounded border" />
                          </TableCell>
                          <TableCell>{img.part}</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                value={editingImage.title}
                                onChange={e => setEditingImage({ ...editingImage, title: e.target.value })}
                                placeholder="Title"
                              />
                            ) : (
                              img.title
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                value={editingImage.alt}
                                onChange={e => setEditingImage({ ...editingImage, alt: e.target.value })}
                                placeholder="Alt text"
                              />
                            ) : (
                              img.alt
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => setEditingImage({ ...editingImage, file: e.target.files?.[0] || null })}
                                />
                                <Button size="sm" onClick={() => handleSaveEditImage(img._id!)}>Save</Button>
                                <Button size="sm" variant="secondary" onClick={handleCancelEditImage}>Cancel</Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" onClick={() => handleEditImage(img)}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(img._id!)}>Delete</Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        )}

        {/* Events Section */}
        {section === "events" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Events</h2>
            <p className="mb-4">Manage events displayed on the website. Add, edit, or delete events below.</p>
            {eventError && <div className="text-red-500 mb-2">{eventError}</div>}
            <Button className="mb-4" onClick={handleOpenAddEvent}>
              <Plus className="w-4 h-4 mr-2" /> Add Event
            </Button>
            {isLoadingEvents ? (
              <div>Loading...</div>
            ) : (
              <>
                <div className="space-y-4 md:hidden">
                  {events.map((event) => {
                    const eventDateTime = new Date(`${event.date}T${event.time}`);
                    const now = new Date();
                    const isCompleted = eventDateTime < now;
                    const statusToShow = isCompleted ? 'Completed' : event.status;
                    return (
                      <div key={event._id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-4 mb-2">
                          {event.image && <img src={event.image} alt="Event" className="w-16 h-16 object-cover rounded border" />}
                          <div>
                            <div className="font-semibold text-sm">{event.title}</div>
                            <div className="text-xs text-gray-500">{event.date} {event.time}</div>
                          </div>
                        </div>
                        <div className="text-gray-700 text-xs mb-1"><span className="font-medium">Location:</span> {event.location}</div>
                        <div className="text-gray-700 text-xs mb-1"><span className="font-medium">Category:</span> {event.category}</div>
                        <div className="text-gray-700 text-xs mb-1"><span className="font-medium">Status:</span> <Badge>{statusToShow}</Badge></div>
                        <div className="flex gap-2 self-end mt-2">
                          <Button size="sm" variant="outline" onClick={() => handleOpenEditEvent(event)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event._id!)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Table className="hidden md:table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => {
                      const eventDateTime = new Date(`${event.date}T${event.time}`);
                      const now = new Date();
                      const isCompleted = eventDateTime < now;
                      const statusToShow = isCompleted ? 'Completed' : event.status;
                      return (
                        <TableRow key={event._id}>
                          <TableCell>{event.title}</TableCell>
                          <TableCell>{event.date}</TableCell>
                          <TableCell>{event.time}</TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>{event.category}</TableCell>
                          <TableCell>
                            <Badge>{statusToShow}</Badge>
                          </TableCell>
                          <TableCell>
                            {event.image && <img src={event.image} alt="Event" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />}
                            <Button size="sm" variant="outline" onClick={() => handleOpenEditEvent(event)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event._id!)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            )}
            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
                  <DialogDescription>
                    {editingEvent ? 'Edit the event details below.' : 'Fill in the details to add a new event.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input name="title" placeholder="Title" value={eventForm.title || ''} onChange={handleEventFormChange} />
                  <Textarea name="description" placeholder="Description" value={eventForm.description || ''} onChange={handleEventFormChange} />
                  <Input name="date" type="date" placeholder="Date" value={eventForm.date || ''} onChange={handleEventFormChange} />
                  <Input name="time" type="time" placeholder="Time" value={eventForm.time || ''} onChange={handleEventFormChange} />
                  <Input name="location" placeholder="Location" value={eventForm.location || ''} onChange={handleEventFormChange} />
                  <Input name="category" placeholder="Category" value={eventForm.category || ''} onChange={handleEventFormChange} />
                  <Select name="status" value={eventForm.status || 'Upcoming'} onValueChange={(value) => setEventForm((prev) => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input name="image" type="file" accept="image/*" onChange={handleEventFormChange} />
                  <Input name="registrationLink" placeholder="Google Form Link" value={eventForm.registrationLink || ''} onChange={handleEventFormChange} />
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveEvent}>{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
                  <Button variant="secondary" onClick={handleCloseEventDialog}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Team Section */}
        {section === "team" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Team Members</h2>
              <Button className="mb-4" onClick={handleOpenAddTeam}>
                <Plus className="w-4 h-4 mr-2" /> Add Team Member
              </Button>
              {teamError && (
                <div className="text-red-500 mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <strong>Error:</strong> {teamError}
                  <br />
                  <small>Make sure the backend server is running and you're logged in as admin.</small>
                </div>
              )}
              {isLoadingTeam ? (
                <div>Loading...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {teamMembers.map((member) => (
                    <div key={member._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center relative">
                      {member.image ? (
                        <img src={member.image.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL}${member.image}` : member.image} alt={member.name} className="w-20 h-20 object-cover rounded-full mb-4" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-2xl font-bold text-red-900 mb-4">
                          {member.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      )}
                      <div className="font-bold text-lg sm:text-base">{member.name}</div>
                      <div className="font-semibold text-red-900 mb-1 text-sm sm:text-xs">{member.position}</div>
                      <div className="text-xs text-gray-500 mb-1">{member.city}</div>
                      {member.core && (
                        <div className="inline-block bg-yellow-200 text-yellow-900 text-xs font-semibold px-2 py-1 rounded mb-1">Core Member</div>
                      )}
                      <div className="text-muted-foreground text-sm sm:text-xs mb-3">{member.description}</div>
                      <div className="flex justify-center gap-3 mb-3">
                        {member.email && (
                          <a href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer"><Mail className="w-5 h-5" /></a>
                        )}
                        {member.phone && (
                          <a href={`tel:${member.phone}`} target="_blank" rel="noopener noreferrer"><Phone className="w-5 h-5" /></a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="w-5 h-5" /></a>
                        )}
                      </div>
                      <div className="flex gap-2 absolute top-4 right-4">
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditTeam(member)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteTeamMember(member._id!)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingTeamMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
                    <DialogDescription>
                      {editingTeamMember ? 'Edit the team member details below.' : 'Fill in the details to add a new team member.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input name="name" placeholder="Name" value={teamForm.name || ''} onChange={handleTeamFormChange} />
                    <Input name="position" placeholder="Position" value={teamForm.position || ''} onChange={handleTeamFormChange} />
                    <Input name="city" placeholder="City" value={teamForm.city || ''} onChange={handleTeamFormChange} />
                    <label className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        name="core"
                        checked={!!teamForm.core}
                        onChange={handleTeamFormChange}
                      />
                      Core Member
                    </label>
                    <Textarea name="description" placeholder="Description" value={teamForm.description || ''} onChange={handleTeamFormChange} />
                    <Input name="image" type="file" accept="image/*" onChange={handleTeamFormChange} />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveTeamMember}>{editingTeamMember ? 'Save Changes' : 'Add Team Member'}</Button>
                    <Button variant="secondary" onClick={handleCloseTeamDialog}>Cancel</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-4">Cities</h2>
              <Button className="mb-4 w-full lg:w-full" onClick={handleOpenAddCity}>
                <Plus className="w-4 h-4 mr-2" /> Add City
              </Button>
              {cityError && <div className="text-red-500 mb-2">{cityError}</div>}
              {isLoadingCities ? (
                <div>Loading...</div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
                  {cities.map((city) => (
                    <div key={city._id} className="bg-white rounded-lg shadow p-2 relative">
                      <div className="relative h-12 md:h-16 mb-2 rounded overflow-hidden">
                        <img
                          src={city.image}
                          alt={city.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-1 left-1">
                          <h3 className="text-white font-bold text-sm">{city.name}</h3>
                        </div>
                      </div>
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Students:</span>
                          <span className="font-semibold text-primary">{city.studentCount}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditCity(city)} className="flex-1">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCity(city._id!)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Dialog open={showCityDialog} onOpenChange={setShowCityDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCity ? 'Edit City' : 'Add City'}</DialogTitle>
                    <DialogDescription>
                      {editingCity ? 'Edit the city details below.' : 'Fill in the details to add a new city.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cityName">City Name *</Label>
                      <Input
                        id="cityName"
                        name="name"
                        placeholder="City Name"
                        value={cityForm.name || ''}
                        onChange={handleCityFormChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentCount">Student Count</Label>
                      <Input
                        id="studentCount"
                        name="studentCount"
                        type="number"
                        min="0"
                        placeholder="Number of students"
                        value={cityForm.studentCount || 0}
                        onChange={handleCityFormChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="registrationLink">Registration Link</Label>
                      <Input
                        id="registrationLink"
                        name="registrationLink"
                        type="url"
                        placeholder="https://forms.google.com/..."
                        value={cityForm.registrationLink || ''}
                        onChange={handleCityFormChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cityImage">City Image {!editingCity && '*'}</Label>
                      <Input
                        id="cityImage"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleCityFormChange}
                      />
                      {editingCity && (
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty to keep current image
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveCity}>
                      {editingCity ? 'Save Changes' : 'Add City'}
                    </Button>
                    <Button variant="secondary" onClick={handleCloseCityDialog}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* Advisors Section */}
        {section === "advisors" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Advisors</h2>
            <div className="flex gap-2 mb-4">
              <Button onClick={handleOpenAddAdvisor}>+ Add Advisor</Button>
              <div className="flex gap-1 ml-4">
                <Button
                  variant={advisorFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAdvisorFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={advisorFilter === 'board' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAdvisorFilter('board')}
                >
                  Board Advisors
                </Button>
                <Button
                  variant={advisorFilter === 'interaction' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAdvisorFilter('interaction')}
                >
                  Interactions
                </Button>
              </div>
            </div>
            {advisorError && <div className="text-red-500 mb-2">{advisorError}</div>}
            {isLoadingAdvisors ? (
              <div>Loading advisors...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {advisors
                  .filter(advisor => {
                    if (advisorFilter === 'all') return true;
                    if (advisorFilter === 'board') return !advisor.isInteraction;
                    if (advisorFilter === 'interaction') return advisor.isInteraction;
                    return true;
                  })
                  .map((advisor) => (
                    <Card key={advisor._id} className="flex flex-col items-center p-4">
                      {advisor.image ? (
                        <img src={advisor.image.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL}${advisor.image}` : advisor.image} alt={advisor.name} className="w-16 h-16 rounded-full object-cover mb-2" />
                      ) : (
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                          <span className="text-xl font-bold text-primary">{advisor.name.split(' ').map((n) => n[0]).join('')}</span>
                        </div>
                      )}
                      <CardTitle className="text-lg font-bold sm:text-base">{advisor.name}</CardTitle>
                      <CardDescription className="text-primary font-medium text-sm sm:text-xs">{advisor.title}</CardDescription>
                      <div className="text-sm sm:text-xs text-muted-foreground mb-2">{advisor.organization}</div>
                      <Badge variant={advisor.isInteraction ? "secondary" : "default"} className="mb-2 text-xs">
                        {advisor.isInteraction ? "Interaction" : "Board Advisor"}
                      </Badge>
                      <div className="text-xs text-muted-foreground mb-2">{advisor.description}</div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {(advisor.expertise || []).map((skill, idx) => (
                          <span key={idx} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{skill}</span>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditAdvisor(advisor)}><Edit className="w-4 h-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteAdvisor(advisor._id!)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
            <Dialog open={showAdvisorDialog} onOpenChange={setShowAdvisorDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAdvisor ? 'Edit Advisor' : 'Add Advisor'}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                  <Input name="name" placeholder="Name" value={advisorForm.name || ''} onChange={handleAdvisorFormChange} />
                  <Input name="title" placeholder="Title" value={advisorForm.title || ''} onChange={handleAdvisorFormChange} />
                  <Input name="organization" placeholder="Organization" value={advisorForm.organization || ''} onChange={handleAdvisorFormChange} />
                  <Textarea name="description" placeholder="Description" value={advisorForm.description || ''} onChange={handleAdvisorFormChange} />
                  <Input name="expertise" placeholder="Expertise (comma separated)" value={(advisorForm.expertise || []).join(', ')} onChange={e => handleAdvisorExpertiseChange(e.target.value)} />
                  <Input name="image" type="file" accept="image/*" onChange={handleAdvisorFormChange} />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isInteraction"
                      name="isInteraction"
                      checked={advisorForm.isInteraction || false}
                      onChange={handleAdvisorFormChange}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isInteraction">Add as Interaction</Label>
                  </div>
                </div>
                {advisorError && <div className="text-red-500 mt-2">{advisorError}</div>}
                <DialogFooter>
                  <Button onClick={handleSaveAdvisor}>{editingAdvisor ? 'Save Changes' : 'Add Advisor'}</Button>
                  <Button variant="secondary" onClick={handleCloseAdvisorDialog}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Password Section */}
        {section === "password" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Change Password (OTP)</h2>
            <div className="bg-white p-6 rounded shadow-md max-w-md flex flex-col gap-4">
              {!otpSent && (
                <>
                  <p className="mb-2 text-sm">Click below to send a one-time password (OTP) to <b>official.turningpointcommunity@gmail.com</b>. You must enter the OTP to change the password.</p>
                  <button
                    className="bg-red-900 text-white py-2 rounded hover:bg-red-800"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || otpCooldown > 0}
                  >
                    {isSendingOtp ? "Sending..." : otpCooldown > 0 ? `Send OTP (${otpCooldown}s)` : "Send OTP"}
                  </button>
                  {otpSendStatus && <div className={otpSendStatus.success ? "text-green-600 text-sm" : "text-red-500 text-sm"}>{otpSendStatus.message}</div>}
                </>
              )}
              {otpSent && (
                <form onSubmit={handleOtpPasswordChange} className="flex flex-col gap-4">
                  <label className="font-medium">Enter OTP (check official.turningpointcommunity@gmail.com)</label>
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    containerClassName="justify-center"
                    className="text-xl tracking-widest text-center"
                    autoFocus
                    required
                  >
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTP>
                  <input
                    type="password"
                    className="border p-2 rounded"
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    className="border p-2 rounded"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    required
                  />
                  {otpChangeError && <div className="text-red-500 text-sm">{otpChangeError}</div>}
                  {otpChangeSuccess && <div className="text-green-600 text-sm">{otpChangeSuccess}</div>}
                  <button
                    type="submit"
                    className="bg-red-900 text-white py-2 rounded hover:bg-red-800"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </button>
                  <button
                    type="button"
                    className="text-xs underline text-gray-600 mt-2"
                    onClick={handleResendOtp}
                    disabled={isSendingOtp || otpCooldown > 0}
                  >
                    {isSendingOtp ? "Resending..." : otpCooldown > 0 ? `Resend OTP (${otpCooldown}s)` : "Resend OTP"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Gallery Section */}
        {section === "gallery" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Gallery</h2>
            <Button className="mb-4" onClick={handleOpenAddGallery}>
              <Plus className="w-4 h-4 mr-2" /> Add Gallery Image
            </Button>
            {galleryError && <div className="text-red-500 mb-2">{galleryError}</div>}
            {isLoadingGallery ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((img) => (
                  <div key={img._id} className="relative bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEditGallery(img)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteGalleryImage(img._id!)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <img src={img.url.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL}${img.url}` : img.url} alt={img.alt} className="w-full h-48 object-cover rounded mb-2" />
                    <div className="font-bold text-lg sm:text-base mb-1">{img.title}</div>
                    <div className="text-muted-foreground text-sm sm:text-xs mb-2">{img.alt}</div>
                  </div>
                ))}
              </div>
            )}
            <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingGalleryImage ? 'Edit Gallery Image' : 'Add Gallery Image'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input name="title" placeholder="Title" value={galleryForm.title || ''} onChange={handleGalleryFormChange} />
                  <Input name="alt" placeholder="Alt text" value={galleryForm.alt || ''} onChange={handleGalleryFormChange} />
                  <Input name="event" placeholder="Event" value={galleryForm.event || ''} onChange={handleGalleryFormChange} />
                  <Input name="date" placeholder="Date" value={galleryForm.date || ''} onChange={handleGalleryFormChange} />
                  <Input name="location" placeholder="Location" value={galleryForm.location || ''} onChange={handleGalleryFormChange} />
                  <Input name="category" placeholder="Category (e.g. Debate, MUN, Workshop, Speaker Session, Social Impact)" value={galleryForm.category || ''} onChange={handleGalleryFormChange} />
                  <Input name="youtube" placeholder="YouTube Video Link (optional)" value={galleryForm.youtube || ''} onChange={handleGalleryFormChange} disabled={!!galleryForm.file} />
                  <div className="text-xs text-muted-foreground">You can add <b>either</b> a YouTube video link <b>or</b> upload an image, not both. Entering a YouTube link disables image upload, and vice versa.</div>
                  <Input name="file" type="file" accept="image/*" onChange={handleGalleryFormChange} disabled={!!galleryForm.youtube && galleryForm.youtube.trim() !== ''} />
                </div>
                {galleryError && <div className="text-red-500 mt-2">{galleryError}</div>}
                <DialogFooter>
                  <Button onClick={handleSaveGalleryImage}>{editingGalleryImage ? 'Save Changes' : 'Add Gallery Image'}</Button>
                  <Button variant="secondary" onClick={handleCloseGalleryDialog}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Contact Submissions Section */}
        {section === "contactSubmissions" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Mail className="inline-block w-6 h-6 text-primary" /> Contact Submissions
            </h2>
            <p className="mb-4">All messages submitted via the Contact Us form.</p>
            {contactSubmissionsError && <div className="text-red-500 mb-2">{contactSubmissionsError}</div>}
            {isLoadingContactSubmissions ? (
              <div>Loading...</div>
            ) : (
              <>
                <div className="space-y-4 md:hidden">
                  {contactSubmissions.length === 0 ? (
                    <div className="text-gray-500">No submissions yet.</div>
                  ) : contactSubmissions.map((sub) => (
                    <div key={sub._id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
                      <div><span className="font-semibold">Name:</span> {sub.name}</div>
                      <div><span className="font-semibold">Email:</span> {sub.email}</div>
                      <div><span className="font-semibold">Phone:</span> {sub.phone}</div>
                      <div><span className="font-semibold">Subject:</span> {sub.subject}</div>
                      <div><span className="font-semibold">Message:</span> {sub.message}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {(() => {
                          const dateStr = sub.submittedAt || (sub._id && typeof sub._id === 'string' && sub._id.length === 24
                            ? new Date(parseInt(sub._id.substring(0, 8), 16) * 1000)
                            : null);
                          if (!dateStr) return <span className="italic text-gray-300">No date</span>;
                          const dateObj = typeof dateStr === 'string' || dateStr instanceof Date ? new Date(dateStr) : dateStr;
                          if (isNaN(dateObj.getTime())) return <span className="italic text-gray-300">No date</span>;
                          return dateObj.toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          });
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
                <Table className="hidden md:table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactSubmissions.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center text-gray-500">No submissions yet.</TableCell></TableRow>
                    ) : contactSubmissions.map((sub) => (
                      <TableRow key={sub._id}>
                        <TableCell>{sub.name}</TableCell>
                        <TableCell>{sub.email}</TableCell>
                        <TableCell>{sub.phone}</TableCell>
                        <TableCell>{sub.subject}</TableCell>
                        <TableCell>{sub.message}</TableCell>
                        <TableCell>
                          {(() => {
                            const dateStr = sub.submittedAt || (sub._id && typeof sub._id === 'string' && sub._id.length === 24
                              ? new Date(parseInt(sub._id.substring(0, 8), 16) * 1000)
                              : null);
                            if (!dateStr) return <span className="italic text-gray-300">No date</span>;
                            const dateObj = typeof dateStr === 'string' || dateStr instanceof Date ? new Date(dateStr) : dateStr;
                            if (isNaN(dateObj.getTime())) return <span className="italic text-gray-300">No date</span>;
                            return dateObj.toLocaleString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            });
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
