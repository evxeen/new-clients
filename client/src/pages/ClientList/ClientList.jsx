import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import styles from './ClientList.module.scss';
import AddClientForm from '../../components/AddClientForm/AddClientForm.jsx';
import { getLastHistoryDate } from '../../../helpers/sortOnDataClients.js';
import { FaBell, FaCalendarAlt, FaTimes } from 'react-icons/fa';

function ClientList() {
  const location = useLocation();
  const navigate = useNavigate();

  // Читаем сохраненные фильтры из URL при открытии страницы
  const initialParams = queryString.parse(location.search, {
    arrayFormat: 'comma',
  });

  const [clients, setClients] = useState([]);
  const [formIsOpen, setFormIsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(initialParams.search || '');

  const [selectedManagers, setSelectedManagers] = useState(() => {
    if (!initialParams.managers) return [];

    return Array.isArray(initialParams.managers)
      ? initialParams.managers
      : [initialParams.managers];
  });

  const [statusFilter, setStatusFilter] = useState(
    initialParams.status || 'all',
  );

  const [regionFilter, setRegionFilter] = useState(
    initialParams.region || 'all',
  );

  const [categoryFilter, setCategoryFilter] = useState(
    initialParams.category || 'all',
  );

  const [dateFilter, setDateFilter] = useState({
    from: initialParams.from || '',
    to: initialParams.to || '',
  });

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showManagerFilter, setShowManagerFilter] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);

  const [showClientsCount, setShowClientsCount] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch('/api/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('Ошибка сервера:', data);
          return;
        }

        // Сортируем по последней дате истории
        const sorted = [...data].sort((a, b) => {
          const dateA = getLastHistoryDate(a);
          const dateB = getLastHistoryDate(b);

          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;

          return dateB - dateA;
        });

        setClients(sorted);
      } catch (err) {
        console.error('Ошибка загрузки клиентов:', err);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch('/api/reminders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('Ошибка загрузки уведомлений:', data);
          return;
        }

        setNotificationCount(data.length);
      } catch (error) {
        console.error('Ошибка загрузки уведомлений:', error);
      }
    };

    fetchNotificationCount();

    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // При каждом изменении фильтров сохраняем их в URL.
  // replace: true нужен, чтобы изменение каждого фильтра
  // не создавало отдельный шаг в истории браузера.
  useEffect(() => {
    const params = {};

    if (searchQuery) {
      params.search = searchQuery;
    }

    if (selectedManagers.length > 0) {
      params.managers = selectedManagers;
    }

    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    if (regionFilter !== 'all') {
      params.region = regionFilter;
    }

    if (categoryFilter !== 'all') {
      params.category = categoryFilter;
    }

    if (dateFilter.from) {
      params.from = dateFilter.from;
    }

    if (dateFilter.to) {
      params.to = dateFilter.to;
    }

    const search = queryString.stringify(params, {
      arrayFormat: 'comma',
    });

    const nextSearch = search ? `?${search}` : '';

    // Не вызываем navigate, если URL уже соответствует фильтрам
    if (location.search !== nextSearch) {
      navigate(
        {
          pathname: location.pathname,
          search: nextSearch,
        },
        {
          replace: true,
        },
      );
    }
  }, [
    searchQuery,
    selectedManagers,
    statusFilter,
    regionFilter,
    categoryFilter,
    dateFilter.from,
    dateFilter.to,
    location.pathname,
    location.search,
    navigate,
  ]);

  const toggleForm = (isOpen) => {
    setFormIsOpen(isOpen);
  };

  const uniqueManagers = useMemo(
    () => [...new Set(clients.map((c) => c.manager).filter(Boolean))],
    [clients],
  );

  const uniqueStatuses = useMemo(
    () => [
      ...new Set(
        clients
          .map((c) => c.history?.[c.history.length - 1]?.status)
          .filter(Boolean),
      ),
    ],
    [clients],
  );

  const uniqueRegions = useMemo(
    () => [...new Set(clients.map((c) => c.country).filter(Boolean))],
    [clients],
  );

  const getCategory = (client) => {
    if (client.mainStatus?.marriage) return 'Отбракованные';
    if (client.mainStatus?.potential) return 'Потенциальные';
    return 'Действующие';
  };

  const handleDateChange = (field, value) => {
    setDateFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetDateFilter = () => {
    setDateFilter({
      from: '',
      to: '',
    });
  };

  const isDateFilterActive = () => {
    return dateFilter.from !== '' || dateFilter.to !== '';
  };

  const filteredClients = clients.filter((client) => {
    const lastStatus = client.history?.[client.history.length - 1]?.status;
    const category = getCategory(client);

    // Фильтр по дате создания
    if (isDateFilterActive()) {
      const clientDate = new Date(client.createDate);

      if (dateFilter.from) {
        const fromDate = new Date(dateFilter.from);
        fromDate.setHours(0, 0, 0, 0);

        if (clientDate < fromDate) {
          return false;
        }
      }

      if (dateFilter.to) {
        const toDate = new Date(dateFilter.to);
        toDate.setHours(23, 59, 59, 999);

        if (clientDate > toDate) {
          return false;
        }
      }
    }

    return (
      (selectedManagers.length === 0 ||
        selectedManagers.includes(client.manager)) &&
      (statusFilter === 'all' || lastStatus === statusFilter) &&
      (regionFilter === 'all' || client.country === regionFilter) &&
      (categoryFilter === 'all' || category === categoryFilter) &&
      client.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getLastActivityDate = (history) => {
    if (!history || Object.keys(history).length === 0) {
      return 'Нет активностей';
    }

    const latestActivity = Object.values(history).sort(
      (a, b) => b.id - a.id,
    )[0];

    return latestActivity?.date?.split(' ')[0] || 'Дата не указана';
  };

  const resetAllFilters = () => {
    setSelectedManagers([]);
    setStatusFilter('all');
    setRegionFilter('all');
    setCategoryFilter('all');
    setDateFilter({
      from: '',
      to: '',
    });
    setSearchQuery('');
    setShowDateFilter(false);
    setShowManagerFilter(false);
  };

  // После загрузки клиентов удаляем из фильтра только тех менеджеров,
  // которых больше нет в списке. До загрузки clients фильтр не трогаем,
  // иначе восстановленные из URL менеджеры сразу бы очистились.
  useEffect(() => {
    if (clients.length === 0) {
      return;
    }

    setSelectedManagers((prev) =>
      prev.filter((manager) => uniqueManagers.includes(manager)),
    );
  }, [clients, uniqueManagers]);

  return (
    <div className={styles.containerContent}>
      {formIsOpen && (
        <AddClientForm
          closeForm={toggleForm}
          onClientAdded={(newClient) =>
            setClients((prev) => [newClient, ...prev])
          }
          existingClients={clients}
        />
      )}

      <div className={styles.header}>
        <div className={styles.additionally}>
          <input
            type="text"
            placeholder="Поиск по названию компании..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Link className={styles.funnelButton} to="/funnel">
            Воронка
          </Link>

          <Link className={styles.funnelButton} to="/leads">
            Лиды
          </Link>
        </div>

        <Link
          className={styles.notificationButton}
          to="/notifications"
          title="Уведомления"
        >
          <FaBell className={styles.notificationIcon} />

          {notificationCount > 0 && (
            <span className={styles.notificationBadge}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </Link>

        <button className={styles.addButton} onClick={() => toggleForm(true)}>
          Добавить
        </button>
      </div>

      <div className={styles.clientsCount}>
        Всего клиентов:
        <button
          type="button"
          className={`${styles.clientsCountValue} ${
            showClientsCount ? styles.visible : ''
          }`}
          onClick={() => setShowClientsCount((prev) => !prev)}
          title={showClientsCount ? 'Скрыть количество' : 'Показать количество'}
        >
          {clients.length}
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.managerFilterContainer}>
          <button
            className={`${styles.filterButton} ${
              selectedManagers.length > 0 ? styles.activeFilter : ''
            }`}
            onClick={() => setShowManagerFilter((prev) => !prev)}
          >
            Менеджеры
            {selectedManagers.length > 0 && ` (${selectedManagers.length})`}
          </button>

          {showManagerFilter && (
            <div className={styles.managerFilterPopup}>
              {uniqueManagers.map((manager) => (
                <label key={manager} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedManagers.includes(manager)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedManagers((prev) => [...prev, manager]);
                      } else {
                        setSelectedManagers((prev) =>
                          prev.filter((m) => m !== manager),
                        );
                      }
                    }}
                  />

                  {manager}
                </label>
              ))}

              {selectedManagers.length > 0 && (
                <button
                  onClick={() => setSelectedManagers([])}
                  className={styles.resetDateButton}
                >
                  Сбросить
                </button>
              )}
            </div>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Все статусы</option>

          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="all">Все страны</option>

          {uniqueRegions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Все категории</option>
          <option value="Действующие">Действующие</option>
          <option value="Потенциальные">Потенциальные</option>
          <option value="Отбракованные">Отбракованные</option>
        </select>

        <div className={styles.dateFilterContainer}>
          <button
            className={`${styles.dateFilterButton} ${
              isDateFilterActive() ? styles.activeFilter : ''
            }`}
            onClick={() => setShowDateFilter((prev) => !prev)}
          >
            <FaCalendarAlt /> Дата создания
          </button>

          {showDateFilter && (
            <div className={styles.dateFilterPopup}>
              <div className={styles.dateInputs}>
                <div className={styles.dateInputGroup}>
                  <label>От:</label>

                  <input
                    type="date"
                    value={dateFilter.from}
                    onChange={(e) => handleDateChange('from', e.target.value)}
                  />
                </div>

                <div className={styles.dateInputGroup}>
                  <label>До:</label>

                  <input
                    type="date"
                    value={dateFilter.to}
                    onChange={(e) => handleDateChange('to', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.dateFilterActions}>
                <button
                  onClick={resetDateFilter}
                  className={styles.resetDateButton}
                  disabled={!isDateFilterActive()}
                >
                  Сбросить даты
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={resetAllFilters}
          className={styles.resetAllButton}
          disabled={
            selectedManagers.length === 0 &&
            statusFilter === 'all' &&
            regionFilter === 'all' &&
            categoryFilter === 'all' &&
            !searchQuery &&
            !isDateFilterActive()
          }
        >
          <FaTimes /> Сбросить все
        </button>
      </div>

      <div className={styles.listContainer}>
        {filteredClients.map((client) => (
          <Link
            key={client.id}
            to={`/client/${client.id}`}
            className={`${styles.clientBlock} ${
              client.mainStatus?.marriage
                ? styles.marriage
                : client.mainStatus?.potential
                  ? styles.potential
                  : styles.active
            }`}
          >
            <div className={styles.clientHeader}>
              <h3>{client.company}</h3>
            </div>

            <p>Менеджер: {client.manager}</p>

            <p>Регион: {client.country}</p>

            <p>Категория: {getCategory(client)}</p>

            <p>Последняя активность: {getLastActivityDate(client.history)}</p>

            <p className={styles.createDate}>
              Создан: {new Date(client.createDate).toLocaleDateString('ru-RU')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ClientList;
