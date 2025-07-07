// src/pages/CustomOrder.jsx
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./CustomOrder.css"

const CustomOrder = () => {
    const navigate = useNavigate()
    const { user, guestId } = useAuth()
    const isGuest = !user

    // 1. State
    const [orderItems, setOrderItems] = useState([
        { customImage: "", imageFile: null, quantity: 1, size: "m", color: "black" }
    ])
    const [guestDetails, setGuestDetails] = useState({
        name: "",
        email: "",
        phone: ""
    })
    const [shippingInfo, setShippingInfo] = useState({
        street: "",
        city: "",
        postalCode: "",
        country: "",
        phone: user?.phone || "",
        email: user?.email || ""
    })
    const [paymentMethod, setPaymentMethod] = useState("CarteEdahabia")
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 2. Cloudinary upload helper
    const uploadToCloudinary = async (file) => {
        const form = new FormData()
        form.append("file", file)
        form.append("upload_preset", "<YOUR_UPLOAD_PRESET>")
        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/<YOUR_CLOUD_NAME>/upload",
            form
        )
        return res.data.secure_url
    }

    // 3. Handlers
    const handleImageUpload = async (idx, file) => {
        try {
            const url = await uploadToCloudinary(file)
            setOrderItems((items) => {
                const next = [...items]
                next[idx] = { ...next[idx], customImage: url, imageFile: file }
                return next
            })
            setErrors((e) => { delete e[`item_${idx}_image`]; return { ...e } })
        } catch (err) {
            console.error("Upload failed:", err)
        }
    }

    const handleImageUrlChange = (idx, url) => {
        setOrderItems((items) => {
            const next = [...items]
            next[idx] = { ...next[idx], customImage: url, imageFile: null }
            return next
        })
        setErrors((e) => { delete e[`item_${idx}_image`]; return { ...e } })
    }

    const handleItemChange = (idx, field, val) => {
        setOrderItems((items) => {
            const next = [...items]
            next[idx][field] =
                field === "quantity"
                    ? Math.max(1, parseInt(val, 10) || 1)
                    : val
            return next
        })
        setErrors((e) => { delete e[`item_${idx}_${field}`]; return { ...e } })
    }

    const addItem = () =>
        setOrderItems((items) => [
            ...items,
            { customImage: "", imageFile: null, quantity: 1, size: "m", color: "black" }
        ])

    const removeItem = (idx) =>
        setOrderItems((items) =>
            items.length > 1 ? items.filter((_, i) => i !== idx) : items
        )

    const handleGuestChange = (field, val) => {
        setGuestDetails((g) => ({ ...g, [field]: val }))
        setErrors((e) => { delete e[`guest_${field}`]; return { ...e } })
    }

    const handleShippingChange = (field, val) => {
        setShippingInfo((s) => ({ ...s, [field]: val }))
        setErrors((e) => { delete e[`shipping_${field}`]; return { ...e } })
    }

    // 4. Validation
    const validate = () => {
        const errs = {}

        orderItems.forEach((it, i) => {
            if (!it.customImage) errs[`item_${i}_image`] = "Image is required"
            if (it.quantity < 1) errs[`item_${i}_quantity`] = "Quantity ≥ 1"
            if (!["s", "m", "L"].includes(it.size))
                errs[`item_${i}_size`] = "Invalid size"
            if (!["black", "White", "Blue", "Red", "Green", "Gray"].includes(it.color))
                errs[`item_${i}_color`] = "Invalid color"
        })

        if (isGuest) {
            if (!guestDetails.name) errs.guest_name = "Name is required"
            if (!/\S+@\S+\.\S+/.test(guestDetails.email))
                errs.guest_email = guestDetails.email
                    ? "Invalid email"
                    : "Email is required"
            if (!guestDetails.phone) errs.guest_phone = "Phone is required"
        }

        if (!shippingInfo.phone) errs.shipping_phone = "Phone is required"
        if (!/\S+@\S+\.\S+/.test(shippingInfo.email))
            errs.shipping_email = shippingInfo.email
                ? "Invalid email"
                : "Email is required"



        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    // 5. Submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        try {
            const token = localStorage.getItem("token")
            const payload = {
                isGuest,
                ...(isGuest && { guestDetails }),
                items: orderItems.map(({ customImage, quantity, size, color }) => ({
                    customImage,
                    quantity,
                    size,
                    color
                })),
                shippingInfo,
                paymentMethod,
                totalAmount: 0
            }

            await axios.post(
                "/api/orders",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    withCredentials: true
                }
            )

            alert("Custom order submitted successfully!")
            navigate("/")
        } catch (err) {
            console.error("Submit error:", err)
            setErrors({ submit: err.response?.data?.error || err.message })
        } finally {
            setIsSubmitting(false)
        }
    }
    // 6. JSX Return
    return (
        <div className="bespoke-order-page">
            <div className="bespoke-order-wrapper">
                <h1 className="bespoke-main-title">Create Custom Order</h1>

                {errors.submit && (
                    <div className="bespoke-error-alert">
                        <p>{errors.submit}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bespoke-order-form">
                    {/* Order Items */}
                    <div className="bespoke-form-section">
                        <h2 className="bespoke-section-header">Order Items</h2>
                        {orderItems.map((item, idx) => (
                            <div key={idx} className="bespoke-item-card">
                                <div className="bespoke-item-header">
                                    <h3>Item {idx + 1}</h3>
                                    {orderItems.length > 1 && (
                                        <button
                                            type="button"
                                            className="bespoke-remove-btn"
                                            onClick={() => removeItem(idx)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="bespoke-input-group">
                                    <label>
                                        Custom Image <span className="bespoke-required">*</span>
                                    </label>
                                    <div className="bespoke-image-upload-area">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id={`file-${idx}`}
                                            onChange={e => handleImageUpload(idx, e.target.files[0])}
                                        />
                                        <span className="bespoke-upload-separator">OR</span>
                                        <input
                                            type="url"
                                            placeholder="Enter image URL"
                                            value={
                                                item.customImage.startsWith("http")
                                                    ? item.customImage
                                                    : ""
                                            }
                                            onChange={e => handleImageUrlChange(idx, e.target.value)}
                                            className="bespoke-url-field"
                                        />
                                        {item.customImage && (
                                            <div className="bespoke-image-preview">
                                                <img src={item.customImage} alt="Preview" />
                                            </div>
                                        )}
                                        {errors[`item_${idx}_image`] && (
                                            <span className="bespoke-error-msg">
                                                {errors[`item_${idx}_image`]}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="bespoke-input-group">
                                    <label>
                                        Quantity <span className="bespoke-required">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={e => handleItemChange(idx, "quantity", e.target.value)}
                                        className="bespoke-number-input"
                                    />
                                    {errors[`item_${idx}_quantity`] && (
                                        <span className="bespoke-error-msg">
                                            {errors[`item_${idx}_quantity`]}
                                        </span>
                                    )}
                                </div>

                                {/* Size */}
                                <div className="bespoke-input-group">
                                    <label>
                                        Size <span className="bespoke-required">*</span>
                                    </label>
                                    <select
                                        value={item.size}
                                        onChange={e => handleItemChange(idx, "size", e.target.value)}
                                        className="bespoke-select-input"
                                    >
                                        <option value="s">Small</option>
                                        <option value="m">Medium</option>
                                        <option value="L">Large</option>
                                    </select>
                                    {errors[`item_${idx}_size`] && (
                                        <span className="bespoke-error-msg">
                                            {errors[`item_${idx}_size`]}
                                        </span>
                                    )}
                                </div>

                                {/* Color */}
                                <div className="bespoke-input-group">
                                    <label>
                                        Color <span className="bespoke-required">*</span>
                                    </label>
                                    <select
                                        value={item.color}
                                        onChange={e => handleItemChange(idx, "color", e.target.value)}
                                        className="bespoke-select-input"
                                    >
                                        <option value="black">Black</option>
                                        <option value="White">White</option>
                                        <option value="Blue">Blue</option>
                                        <option value="Red">Red</option>
                                        <option value="Green">Green</option>
                                        <option value="Gray">Gray</option>
                                    </select>
                                    {errors[`item_${idx}_color`] && (
                                        <span className="bespoke-error-msg">
                                            {errors[`item_${idx}_color`]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addItem}
                            className="bespoke-add-item-btn"
                        >
                            + Add Another Item
                        </button>
                    </div>

                    {/* Guest Details */}
                    {isGuest && (
                        <div className="bespoke-form-section">
                            <h2 className="bespoke-section-header">Your Information</h2>
                            <div className="bespoke-input-group">
                                <label>
                                    Name <span className="bespoke-required">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={guestDetails.name}
                                    onChange={e => handleGuestChange("name", e.target.value)}
                                    className="bespoke-text-input"
                                />
                                {errors.guest_name && (
                                    <span className="bespoke-error-msg">
                                        {errors.guest_name}
                                    </span>
                                )}
                            </div>
                            <div className="bespoke-input-group">
                                <label>
                                    Email <span className="bespoke-required">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={guestDetails.email}
                                    onChange={e => handleGuestChange("email", e.target.value)}
                                    className="bespoke-text-input"
                                />
                                {errors.guest_email && (
                                    <span className="bespoke-error-msg">
                                        {errors.guest_email}
                                    </span>
                                )}
                            </div>
                            <div className="bespoke-input-group">
                                <label>
                                    Phone <span className="bespoke-required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={guestDetails.phone}
                                    onChange={e => handleGuestChange("phone", e.target.value)}
                                    className="bespoke-text-input"
                                />
                                {errors.guest_phone && (
                                    <span className="bespoke-error-msg">
                                        {errors.guest_phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Shipping Information */}
                    <div className="bespoke-form-section">
                        <h2 className="bespoke-section-header">Shipping Information</h2>
                        <div className="bespoke-input-group">
                            <label>Street Address</label>
                            <input
                                type="text"
                                value={shippingInfo.street}
                                onChange={e => handleShippingChange("street", e.target.value)}
                                className="bespoke-text-input"
                            />
                        </div>
                        <div className="bespoke-input-row">
                            <div className="bespoke-input-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    value={shippingInfo.city}
                                    onChange={e => handleShippingChange("city", e.target.value)}
                                    className="bespoke-text-input"
                                />
                            </div>
                            <div className="bespoke-input-group">
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    value={shippingInfo.postalCode}
                                    onChange={e => handleShippingChange("postalCode", e.target.value)}
                                    className="bespoke-text-input"
                                />
                            </div>
                        </div>
                        <div className="bespoke-input-group">
                            <label>Country</label>
                            <input
                                type="text"
                                value={shippingInfo.country}
                                onChange={e => handleShippingChange("country", e.target.value)}
                                className="bespoke-text-input"
                            />
                        </div>
                        <div className="bespoke-input-row">
                            <div className="bespoke-input-group">
                                <label>
                                    Phone <span className="bespoke-required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={shippingInfo.phone}
                                    onChange={e => handleShippingChange("phone", e.target.value)}
                                    className="bespoke-text-input"
                                />
                                {errors.shipping_phone && (
                                    <span className="bespoke-error-msg">
                                        {errors.shipping_phone}
                                    </span>
                                )}
                            </div>
                            <div className="bespoke-input-group">
                                <label>
                                    Email <span className="bespoke-required">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={shippingInfo.email}
                                    onChange={e => handleShippingChange("email", e.target.value)}
                                    className="bespoke-text-input"
                                />
                                {errors.shipping_email && (
                                    <span className="bespoke-error-msg">
                                        {errors.shipping_email}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bespoke-form-section">
                        <h2 className="bespoke-section-header">Payment Method</h2>
                        <div className="bespoke-payment-options">

                            <label className="bespoke-payment-choice">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CarteEdahabia"
                                    checked={paymentMethod === "CarteEdahabia"}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                />
                                <span className="bespoke-payment-label">💳 Carte Edahabia</span>
                            </label>
                            <label className="bespoke-payment-choice">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CashOnDelivery"
                                    checked={paymentMethod === "CashOnDelivery"}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                />
                                <span className="bespoke-payment-label">💰 Cash on Delivery</span>
                            </label>
                        </div>
                        {errors.paymentMethod && (
                            <span className="bespoke-error-msg">
                                {errors.paymentMethod}
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bespoke-submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="bespoke-spinner"></span> Submitting...
                            </>
                        ) : (
                            <>
                                <span className="bespoke-btn-icon">🛒</span> Submit Custom Order
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )

}

export default CustomOrder
