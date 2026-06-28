import React, { useEffect, useState } from "react";
import { Trash, Pencil, Upload, X } from "lucide-react";

const ListItems = () => {
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProductList(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/types")
      .then((res) => res.json())
      .then((data) => setTypes(data));
  }, []);

  const getCategoryName = (id) =>
    categories.find((c) => Number(c.id) === Number(id))?.name || "ندارد";

  const getTypeName = (id) =>
    types.find((t) => Number(t.id) === Number(id))?.name || "ندارد";

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
    }).then(() => {
      setProductList((prev) => prev.filter((p) => p.id !== id));
    });
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setEditItem((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? "/cloths/" + files[0].name
          : value,
    }));
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();

    fetch(`http://localhost:3000/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editItem),
    });

    setEditItem(null);
  };

  return (
    <div className="p-4 sm:p-6">

      {/* HEADER (desktop only) */}
      <div className="hidden sm:grid grid-cols-[80px_1fr_1fr_1fr_120px] gap-4 font-bold mb-4 text-gray-700">
        <div>عکس</div>
        <div>نام محصول</div>
        <div>دسته بندی</div>
        <div>نوع</div>
        <div className="text-center">عملیات</div>
      </div>

      {/* LIST */}
      <div className="space-y-4">

        {productList.map((item) => (
          <div
            key={item.id}
            className="
              bg-white border rounded-xl p-4
              grid grid-cols-1 sm:grid-cols-[80px_1fr_1fr_1fr_120px]
              items-center gap-4
              hover:shadow-md transition
            "
          >

            {/* Image */}
            <img
              src={item.image}
              className="w-14 h-14 object-cover rounded"
              alt=""
            />

            {/* Title */}
            <div className="text-sm font-medium">
              {item.title}
            </div>

            {/* Category */}
            <div className="text-gray-600 text-sm">
              {getCategoryName(item.categoryId)}
            </div>

            {/* Type */}
            <div className="text-gray-600 text-sm">
              {getTypeName(item.typeId)}
            </div>

            {/* ACTIONS (FIXED FOR LG) */}
            <div className="flex items-center justify-end gap-3">

              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded hover:bg-red-50 transition"
              >
                <Trash className="w-5 h-5 text-red-500" />
              </button>

              <button
                onClick={() => setEditItem(item)}
                className="p-2 rounded hover:bg-blue-50 transition"
              >
                <Pencil className="w-5 h-5 text-blue-500" />
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* EDIT MODAL */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <form
            onSubmit={(e) => handleSubmit(e, editItem.id)}
            className="bg-white w-full max-w-md p-6 rounded-xl space-y-4 relative"
          >

            <X
              className="absolute top-3 right-3 cursor-pointer text-red-500"
              onClick={() => setEditItem(null)}
            />

            <input
              name="title"
              value={editItem.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="نام محصول"
            />

            <select
              name="categoryId"
              value={editItem.categoryId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              name="typeId"
              value={editItem.typeId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full"
            />

            <button
              type="submit"
              className="w-full bg-red-400 text-white py-2 rounded"
            >
              ذخیره تغییرات
            </button>

          </form>
        </div>
      )}

    </div>
  );
};

export default ListItems;