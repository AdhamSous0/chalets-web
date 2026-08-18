"use client";

import { useEffect, useMemo, useState } from "react";
import { IconCalendar, IconCheck, IconLocation, IconStar, IconUser } from "@/components/icons";
import { Button, Card, Chip, Input, SectionHead } from "@/components/ui";
import { useApp } from "@/lib/app-context";
import { createChalet, updateChalet, getChalets, getUsers, ApiError } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";
import {
  ALL_AMENITIES,
  CITY_COORDS,
  CITY_KEYS,
  CONTACT_TYPES,
  PAYMENT_METHODS,
  TYPE_KEYS,
  type AdminUser,
  type AmenityKey,
  type Chalet,
  type CityKey,
  type ContactType,
  type MediaItem,
  type PaymentMethod,
  type TypeKey,
} from "@/lib/data";

interface FormState {
  nameAr: string;
  nameEn: string;
  cityKey: CityKey;
  areaAr: string;
  areaEn: string;
  typeKey: TypeKey;
  capacity: number;
  priceWeekday: number;
  priceWeekend: number;
  amenities: AmenityKey[];
  descriptionAr: string;
  descriptionEn: string;
  ownerNameAr: string;
  ownerNameEn: string;
  contacts: { type: ContactType; value: string }[];
  acceptedPaymentMethods: PaymentMethod[];
}

const emptyForm: FormState = {
  nameAr: "",
  nameEn: "",
  cityKey: "jericho",
  areaAr: "",
  areaEn: "",
  typeKey: "family",
  capacity: 6,
  priceWeekday: 300,
  priceWeekend: 400,
  amenities: [],
  descriptionAr: "",
  descriptionEn: "",
  ownerNameAr: "",
  ownerNameEn: "",
  contacts: [],
  acceptedPaymentMethods: ["cash", "card"],
};

export function AdminClient() {
  const { t, rtl } = useApp();
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [removeMediaIds, setRemoveMediaIds] = useState<string[]>([]);

  const token = getAdminToken();

  useEffect(() => {
    getChalets().then(setChalets).catch(() => setChalets([]));
    if (token) getUsers(token).then(setUsers).catch(() => setUsers([]));
  }, [token]);

  const totalBookings = useMemo(
    () => chalets.reduce((sum, c) => sum + c.bookingsThisSeason, 0),
    [chalets],
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (a: AmenityKey) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));

  const togglePayment = (m: PaymentMethod) =>
    setForm((prev) => ({
      ...prev,
      acceptedPaymentMethods: prev.acceptedPaymentMethods.includes(m)
        ? prev.acceptedPaymentMethods.filter((x) => x !== m)
        : [...prev.acceptedPaymentMethods, m],
    }));

  const addContact = () =>
    setForm((prev) => ({ ...prev, contacts: [...prev.contacts, { type: "phone", value: "" }] }));

  const updateContact = (i: number, patch: Partial<{ type: ContactType; value: string }>) =>
    setForm((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    }));

  const removeContact = (i: number) =>
    setForm((prev) => ({ ...prev, contacts: prev.contacts.filter((_, idx) => idx !== i) }));

  const startEdit = (c: Chalet) => {
    setEditingId(c.id);
    setForm({
      nameAr: c.nameAr,
      nameEn: c.nameEn,
      cityKey: c.cityKey,
      areaAr: c.areaAr,
      areaEn: c.areaEn,
      typeKey: c.typeKey,
      capacity: c.capacity,
      priceWeekday: c.priceWeekday,
      priceWeekend: c.priceWeekend,
      amenities: c.amenities,
      descriptionAr: c.descriptionAr,
      descriptionEn: c.descriptionEn,
      ownerNameAr: c.ownerNameAr,
      ownerNameEn: c.ownerNameEn,
      contacts: c.contacts.map((ct) => ({ type: ct.type, value: ct.value })),
      acceptedPaymentMethods: c.acceptedPaymentMethods,
    });
    setExistingMedia(c.media ?? []);
    setRemoveMediaIds([]);
    setImages([]);
    setVideo(null);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setExistingMedia([]);
    setRemoveMediaIds([]);
    setImages([]);
    setVideo(null);
    setSubmitError(null);
  };

  const removeExistingMedia = (id: string) => {
    setExistingMedia((prev) => prev.filter((m) => m.id !== id));
    setRemoveMediaIds((prev) => [...prev, id]);
  };

  const onImagesSelected = (files: FileList | null) => {
    if (!files) return;
    // نسخة فورية من FileList — عشان ما تنفرغ لو انعادت استدعاء الدالة (StrictMode) بعد ما نصفّر input.value
    const selected = Array.from(files);
    setImages((prev) => [...prev, ...selected]);
  };

  const onVideoSelected = (files: FileList | null) => {
    const file = files?.[0];
    if (file) setVideo(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!form.nameAr || !form.nameEn || !form.areaAr || !form.areaEn || !form.ownerNameAr || !form.ownerNameEn) return;
    if (form.acceptedPaymentMethods.length === 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      if (editingId) {
        const updated = await updateChalet(
          editingId,
          {
            ...form,
            ...CITY_COORDS[form.cityKey],
            contacts: form.contacts.filter((c) => c.value.trim()),
            images,
            video,
            removeMediaIds,
          },
          token,
        );
        setChalets((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        cancelEdit();
        setJustUpdated(true);
        setTimeout(() => setJustUpdated(false), 4000);
      } else {
        const created = await createChalet(
          {
            ...form,
            ...CITY_COORDS[form.cityKey],
            contacts: form.contacts.filter((c) => c.value.trim()),
            images,
            video,
          },
          token,
        );
        setChalets((prev) => [created, ...prev]);
        setForm(emptyForm);
        setImages([]);
        setVideo(null);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 4000);
      }
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "تعذّرت العملية");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell py-10">
      <h1 className="text-headline font-extrabold tracking-tight text-ink">{t("admin_title")}</h1>
      <p className="mt-1 text-body text-ink-muted">{t("admin_subtitle")}</p>

      {/* إحصائيات */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<IconLocation width={20} height={20} />} label={t("stat_chalets")} value={chalets.length} />
        <StatCard icon={<IconUser width={20} height={20} />} label={t("stat_users")} value={users.length} />
        <StatCard icon={<IconCalendar width={20} height={20} />} label={t("stat_bookings")} value={totalBookings} />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
        <section>
          {/* جدول الشاليهات */}
          <SectionHead title={t("admin_chalets_table")} />
          <div className="overflow-x-auto rounded-card border border-line bg-white">
            <table className="w-full text-start text-body">
              <thead>
                <tr className="border-b border-line text-caption text-ink-muted">
                  <th className="px-4 py-3 text-start font-semibold">{t("admin_name_ar")}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t("filter_city")}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t("filter_type")}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t("jd")}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t("review_unit")}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t("stat_bookings")}</th>
                  <th className="px-4 py-3 text-start font-semibold" />
                </tr>
              </thead>
              <tbody>
                {chalets.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink">{rtl ? c.nameAr : c.nameEn}</td>
                    <td className="px-4 py-3 text-ink-muted">{t(`city_${c.cityKey}`)}</td>
                    <td className="px-4 py-3 text-ink-muted">{t(`type_${c.typeKey}`)}</td>
                    <td className="px-4 py-3 tabular-nums text-ink-muted">{c.priceWeekday}</td>
                    <td className="px-4 py-3">
                      {c.rating == null ? (
                        <span className="text-caption text-ink-faint">{t("admin_no_rating_yet")}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 tabular-nums text-ink">
                          <IconStar filled width={13} height={13} className="text-sand" />
                          {c.rating.toFixed(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink-muted">{c.bookingsThisSeason}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="text-caption font-semibold text-teal hover:underline"
                      >
                        {t("admin_edit")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* جدول المستخدمين */}
          <div className="mt-10">
            <SectionHead title={t("admin_users_table")} />
            <div className="overflow-x-auto rounded-card border border-line bg-white">
              <table className="w-full text-start text-body">
                <thead>
                  <tr className="border-b border-line text-caption text-ink-muted">
                    <th className="px-4 py-3 text-start font-semibold">{t("admin_name_ar")}</th>
                    <th className="px-4 py-3 text-start font-semibold">{t("filter_city")}</th>
                    <th className="px-4 py-3 text-start font-semibold">{t("admin_joined")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-semibold text-ink">{rtl ? u.nameAr : u.nameEn}</td>
                      <td className="px-4 py-3 text-ink-muted">{u.cityKey ? t(`city_${u.cityKey}`) : "—"}</td>
                      <td className="px-4 py-3 tabular-nums text-ink-muted">
                        {new Date(u.joinedAt).toLocaleDateString(rtl ? "ar" : "en")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* نموذج إضافة شاليه */}
        <aside>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-section font-bold text-ink">{editingId ? t("admin_edit_chalet") : t("admin_add_chalet")}</h2>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="text-caption font-semibold text-ink-muted hover:text-ink">
                  {t("cancel")}
                </button>
              )}
            </div>
            <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
              <Input placeholder={t("admin_name_ar")} value={form.nameAr} onChange={(e) => update("nameAr", e.target.value)} required />
              <Input placeholder={t("admin_name_en")} value={form.nameEn} onChange={(e) => update("nameEn", e.target.value)} required />

              <label className="flex flex-col gap-1.5 text-caption font-semibold text-ink-muted">
                {t("filter_city")}
                <select
                  value={form.cityKey}
                  onChange={(e) => update("cityKey", e.target.value as CityKey)}
                  className="rounded-field border border-line bg-white px-3 py-2.5 text-body text-ink outline-none focus:border-teal"
                >
                  {CITY_KEYS.map((c) => (
                    <option key={c} value={c}>
                      {t(`city_${c}`)}
                    </option>
                  ))}
                </select>
              </label>

              <Input placeholder={t("admin_area_ar")} value={form.areaAr} onChange={(e) => update("areaAr", e.target.value)} required />
              <Input placeholder={t("admin_area_en")} value={form.areaEn} onChange={(e) => update("areaEn", e.target.value)} required />

              <label className="flex flex-col gap-1.5 text-caption font-semibold text-ink-muted">
                {t("filter_type")}
                <select
                  value={form.typeKey}
                  onChange={(e) => update("typeKey", e.target.value as TypeKey)}
                  className="rounded-field border border-line bg-white px-3 py-2.5 text-body text-ink outline-none focus:border-teal"
                >
                  {TYPE_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {t(`type_${k}`)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-caption font-semibold text-ink-muted">
                {t("admin_capacity")}
                <Input type="number" min={1} value={form.capacity} onChange={(e) => update("capacity", Number(e.target.value))} />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-caption font-semibold text-ink-muted">
                  {t("admin_price_weekday")}
                  <Input
                    type="number"
                    min={0}
                    value={form.priceWeekday}
                    onChange={(e) => update("priceWeekday", Number(e.target.value))}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-caption font-semibold text-ink-muted">
                  {t("admin_price_weekend")}
                  <Input
                    type="number"
                    min={0}
                    value={form.priceWeekend}
                    onChange={(e) => update("priceWeekend", Number(e.target.value))}
                  />
                </label>
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-caption font-semibold text-ink-muted">{t("filter_amenities")}</legend>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITIES.map((a) => (
                    <Chip key={a} label={t(`amenity_${a}`)} selected={form.amenities.includes(a)} onClick={() => toggleAmenity(a)} />
                  ))}
                </div>
              </fieldset>

              {/* طرق الدفع المقبولة */}
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-caption font-semibold text-ink-muted">{t("admin_payment_methods")}</legend>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <Chip
                      key={m}
                      label={t(m === "cash" ? "pay_cash" : "pay_card")}
                      selected={form.acceptedPaymentMethods.includes(m)}
                      onClick={() => togglePayment(m)}
                    />
                  ))}
                </div>
                {form.acceptedPaymentMethods.length === 0 && (
                  <p className="text-caption text-danger">{t("admin_payment_methods_hint")}</p>
                )}
              </fieldset>

              {/* وسائل التواصل مع المالك */}
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-caption font-semibold text-ink-muted">{t("admin_contacts")}</legend>
                {form.contacts.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={c.type}
                      onChange={(e) => updateContact(i, { type: e.target.value as ContactType })}
                      className="rounded-field border border-line bg-white px-2 py-2.5 text-caption text-ink outline-none focus:border-teal"
                    >
                      {CONTACT_TYPES.map((ct) => (
                        <option key={ct} value={ct}>
                          {t(`contact_type_${ct}`)}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder={t("admin_contact_value_placeholder")}
                      value={c.value}
                      onChange={(e) => updateContact(i, { value: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => removeContact(i)}
                      aria-label={t("admin_remove")}
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-ink/70 text-[13px] font-bold text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addContact}
                  className="inline-flex w-fit items-center gap-2 rounded-btn border border-dashed border-line px-3 py-2 text-caption font-semibold text-ink-muted transition-colors hover:border-teal hover:text-teal"
                >
                  {t("admin_add_contact")}
                </button>
              </fieldset>

              {/* الصور */}
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-caption font-semibold text-ink-muted">{t("admin_photos")}</legend>
                {existingMedia.filter((m) => m.type === "image").length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {existingMedia
                      .filter((m) => m.type === "image")
                      .map((m) => (
                        <div key={m.id} className="group relative size-16 overflow-hidden rounded-btn border border-line">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={m.url} alt="" className="size-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingMedia(m.id)}
                            aria-label={t("admin_remove")}
                            className="absolute end-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-ink/70 text-[11px] font-bold text-white"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                  </div>
                )}
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {images.map((file, i) => (
                      <div key={i} className="group relative size-16 overflow-hidden rounded-btn border border-line">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="" className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                          aria-label={t("admin_remove")}
                          className="absolute end-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-ink/70 text-[11px] font-bold text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-btn border border-dashed border-line px-3 py-2 text-caption font-semibold text-ink-muted transition-colors hover:border-teal hover:text-teal">
                  {t("admin_add_photos")}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      onImagesSelected(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
              </fieldset>

              {/* الفيديو */}
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-caption font-semibold text-ink-muted">{t("admin_video")}</legend>
                {existingMedia
                  .filter((m) => m.type === "video")
                  .map((m) => (
                    <div key={m.id} className="relative w-fit">
                      <video src={m.url} muted controls className="h-28 rounded-btn border border-line" />
                      <button
                        type="button"
                        onClick={() => removeExistingMedia(m.id)}
                        aria-label={t("admin_remove")}
                        className="absolute end-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-ink/70 text-[11px] font-bold text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                {video && (
                  <div className="relative w-fit">
                    <video src={URL.createObjectURL(video)} muted controls className="h-28 rounded-btn border border-line" />
                    <button
                      type="button"
                      onClick={() => setVideo(null)}
                      aria-label={t("admin_remove")}
                      className="absolute end-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-ink/70 text-[11px] font-bold text-white"
                    >
                      ×
                    </button>
                  </div>
                )}
                <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-btn border border-dashed border-line px-3 py-2 text-caption font-semibold text-ink-muted transition-colors hover:border-teal hover:text-teal">
                  {t("admin_add_video")}
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      onVideoSelected(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
              </fieldset>

              <textarea
                placeholder={t("admin_description_ar")}
                value={form.descriptionAr}
                onChange={(e) => update("descriptionAr", e.target.value)}
                rows={3}
                className="w-full rounded-field border border-line bg-white px-4 py-3 text-body text-ink placeholder:text-ink-muted outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                required
              />
              <textarea
                placeholder={t("admin_description_en")}
                value={form.descriptionEn}
                onChange={(e) => update("descriptionEn", e.target.value)}
                rows={3}
                className="w-full rounded-field border border-line bg-white px-4 py-3 text-body text-ink placeholder:text-ink-muted outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                required
              />

              <Input
                placeholder={t("admin_owner_name_ar")}
                value={form.ownerNameAr}
                onChange={(e) => update("ownerNameAr", e.target.value)}
                required
              />
              <Input
                placeholder={t("admin_owner_name_en")}
                value={form.ownerNameEn}
                onChange={(e) => update("ownerNameEn", e.target.value)}
                required
              />

              <Button type="submit" full disabled={submitting || form.acceptedPaymentMethods.length === 0}>
                {editingId ? t("admin_save_changes") : t("admin_submit")}
              </Button>

              {(justAdded || justUpdated) && (
                <p className="flex items-center gap-2 rounded-chip bg-ok/12 px-3 py-2 text-caption font-semibold text-ok">
                  <IconCheck width={15} height={15} />
                  {justUpdated ? t("admin_updated_success") : t("admin_added_success")}
                </p>
              )}
              {submitError && (
                <p className="rounded-chip bg-danger/12 px-3 py-2 text-caption font-semibold text-danger">{submitError}</p>
              )}
            </form>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal-light text-teal">{icon}</span>
      <span>
        <span className="block text-headline font-extrabold tabular-nums text-ink">{value}</span>
        <span className="block text-caption text-ink-muted">{label}</span>
      </span>
    </Card>
  );
}
