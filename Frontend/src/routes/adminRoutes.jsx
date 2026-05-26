return (
  <div className="max-w-7xl mx-auto px-4 py-8">

    <div className="mb-10">

      <h1 className="text-5xl font-extrabold text-gray-800">
        Manage Users
      </h1>

      <p className="text-gray-500 mt-3 text-lg">
        View and manage all registered users.
      </p>

    </div>

    {loading ? (

      <div className="flex justify-center items-center min-h-[40vh]">

        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>

      </div>

    ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {users.map((user) => (

          <div
            key={user._id}
            className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5"
          >

            <div className="flex justify-between items-start mb-5">

              <div>

                <h3 className="text-2xl font-extrabold text-gray-800">
                  {user.name}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {user.email}
                </p>

              </div>

              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full capitalize">
                {user.role}
              </span>

            </div>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Phone
                </span>

                <span className="font-semibold text-gray-700">
                  {user.phone || "Not Added"}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Address
                </span>

                <span className="font-semibold text-gray-700">
                  {user.address || "Not Added"}
                </span>

              </div>

            </div>

          </div>
        ))}

      </div>
    )}
  </div>
);